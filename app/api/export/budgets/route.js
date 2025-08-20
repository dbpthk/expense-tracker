import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";

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

    // Get all budgets for the user
    const budgets = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, email));

    if (format === "csv") {
      // Generate CSV
      const csvHeaders = [
        "ID",
        "Budget Name",
        "Amount (AUD)",
        "Total Spent (AUD)",
        "Remaining (AUD)",
        "Created Date",
        "Icon",
        "Color",
        "Time Period",
      ];

      const csvRows = budgets.map((budget) => {
        const totalSpent = Number(budget.totalSpend || 0);
        const remaining = Number(budget.amount) - totalSpent;

        return [
          budget.id,
          `"${budget.name}"`,
          budget.amount,
          totalSpent,
          remaining,
          budget.createdAt,
          budget.icon || "",
          budget.color || "",
          budget.timePeriod || "monthly",
        ];
      });

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="budgets-${
            new Date().toISOString().split("T")[0]
          }.csv"`,
        },
      });
    } else if (format === "json") {
      // Generate JSON
      const jsonData = {
        exportDate: new Date().toISOString(),
        totalBudgets: budgets.length,
        totalBudgetAmount: budgets.reduce(
          (sum, budget) => sum + Number(budget.amount),
          0
        ),
        totalSpent: budgets.reduce(
          (sum, budget) => sum + Number(budget.totalSpend || 0),
          0
        ),
        currency: "AUD",
        budgets: budgets.map((budget) => {
          const totalSpent = Number(budget.totalSpend || 0);
          const remaining = Number(budget.amount) - totalSpent;

          return {
            id: budget.id,
            name: budget.name,
            amount: Number(budget.amount),
            totalSpent,
            remaining,
            createdAt: budget.createdAt,
            icon: budget.icon,
            color: budget.color,
            timePeriod: budget.timePeriod || "monthly",
            spendingPercentage: (totalSpent / Number(budget.amount)) * 100,
          };
        }),
      };

      return new NextResponse(JSON.stringify(jsonData, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="budgets-${
            new Date().toISOString().split("T")[0]
          }.json"`,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Unsupported format" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error exporting budgets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
