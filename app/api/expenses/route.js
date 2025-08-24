import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Expenses, Budgets } from "@/utils/schema";
import { eq, desc, inArray } from "drizzle-orm";

export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // SECURITY FIX: Get user email directly from Clerk authentication
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    // Get user's budgets first
    const userBudgets = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, userEmail));

    const budgetIds = userBudgets.map((b) => b.id);

    // Only fetch expenses that belong to user's budgets
    const expenses =
      budgetIds.length > 0
        ? await db
            .select()
            .from(Expenses)
            .where(inArray(Expenses.budgetId, budgetIds))
            .orderBy(desc(Expenses.id))
        : [];

    const budgetMap = {};
    userBudgets.forEach((budget) => {
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

    // SECURITY FIX: Get user email directly from Clerk authentication
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    const body = await request.json();
    const { name, amount, budgetId, color } = body;

    if (!name || !amount || !budgetId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate that the budget belongs to the user
    const userBudgets = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, userEmail));

    const budgetIds = userBudgets.map((b) => b.id);
    if (!budgetIds.includes(Number(budgetId))) {
      return NextResponse.json(
        { error: "Budget not found or access denied" },
        { status: 403 }
      );
    }

    // Get budget name for category
    const budget = userBudgets.find((b) => b.id === Number(budgetId));
    const category = budget ? budget.name : "Unknown";

    const result = await db
      .insert(Expenses)
      .values({
        name,
        amount: amount.toString(),
        budgetId: Number(budgetId),
        category,
        color: color || "#3B82F6",
        createdAt: new Date().toISOString().split("T")[0],
        createdBy: userEmail, // SECURITY: Always use authenticated user's email
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
