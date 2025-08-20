export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Expenses, Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";
import ExcelJS from "exceljs";

export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter required" },
        { status: 400 }
      );
    }

    // Fetch all expenses for the user
    const expenses = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        budgetId: Expenses.budgetId,
        budgetName: Budgets.name,
        budgetIcon: Budgets.icon,
        budgetColor: Budgets.color,
      })
      .from(Expenses)
      .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
      .where(eq(Expenses.createdBy, email));

    if (format === "csv") {
      const csvHeaders = [
        "ID",
        "Expense Name",
        "Amount (AUD)",
        "Date",
        "Budget Category",
        "Budget Icon",
      ];

      const csvRows = expenses.map((expense) => [
        expense.id,
        `"${expense.name}"`,
        expense.amount,
        expense.createdAt,
        `"${expense.budgetName || "Unknown"}"`,
        expense.budgetIcon || "",
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="expenses-${
            new Date().toISOString().split("T")[0]
          }.csv"`,
        },
      });
    } else if (format === "json") {
      const jsonData = {
        exportDate: new Date().toISOString(),
        totalExpenses: expenses.length,
        totalAmount: expenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
        currency: "AUD",
        expenses: expenses.map((expense) => ({
          id: expense.id,
          name: expense.name,
          amount: Number(expense.amount),
          date: expense.createdAt,
          budget: {
            name: expense.budgetName,
            icon: expense.budgetIcon,
            color: expense.budgetColor,
          },
        })),
      };

      return new NextResponse(JSON.stringify(jsonData, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="expenses-${
            new Date().toISOString().split("T")[0]
          }.json"`,
        },
      });
    } else if (format === "xlsx") {
      // Generate Excel file
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Expenses");

      // Header row
      sheet.addRow([
        "ID",
        "Expense Name",
        "Amount (AUD)",
        "Date",
        "Budget Category",
        "Budget Icon",
      ]);

      // Expense rows
      expenses.forEach((exp) => {
        sheet.addRow([
          exp.id,
          exp.name,
          exp.amount,
          exp.createdAt,
          exp.budgetName || "Unknown",
          exp.budgetIcon || "",
        ]);
      });

      const buffer = await workbook.xlsx.writeBuffer();

      return new NextResponse(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="expenses-${
            new Date().toISOString().split("T")[0]
          }.xlsx"`,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Unsupported format" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error exporting expenses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
