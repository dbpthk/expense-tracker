import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Expenses, Budgets } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expenses = await db
      .select()
      .from(Expenses)
      .orderBy(desc(Expenses.id));

    const budgets = await db.select().from(Budgets);

    const budgetMap = {};
    budgets.forEach((budget) => {
      budgetMap[budget.id] = budget.name;
    });

    const result = expenses.map((expense) => ({
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      createdAt: expense.createdAt,
      budgetId: expense.budgetId,
      category: expense.category || budgetMap[expense.budgetId] || "Unknown",
      color: expense.color,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, amount, budgetId, color } = body;

    if (!name || !amount || !budgetId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get budget name for category
    const budgets = await db.select().from(Budgets);
    const budget = budgets.find((b) => b.id === budgetId);
    const category = budget ? budget.name : "Unknown";

    const result = await db
      .insert(Expenses)
      .values({
        name,
        amount: amount.toString(),
        budgetId,
        category,
        color: color || "#3B82F6",
        createdAt: new Date().toISOString().split("T")[0],
      })
      .returning({ insertedId: Expenses.id });

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
