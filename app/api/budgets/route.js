import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Budgets, Expenses } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Get budgets first
    const budgets = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, email))
      .orderBy(desc(Budgets.id));

    // Get expenses for calculating totalSpend
    const expenses = await db
      .select({
        budgetId: Expenses.budgetId,
        amount: Expenses.amount,
      })
      .from(Expenses);

    // Calculate totalSpend for each budget
    const result = budgets.map((budget) => {
      const budgetExpenses = expenses.filter(
        (exp) => exp.budgetId === budget.id
      );
      const totalSpend = budgetExpenses.reduce(
        (sum, exp) => sum + parseFloat(exp.amount || 0),
        0
      );
      const totalItem = budgetExpenses.length;

      return {
        id: budget.id,
        name: budget.name,
        amount: budget.amount,
        icon: budget.icon,
        color: budget.color,
        createdBy: budget.createdBy,
        createdAt: budget.createdAt,
        timePeriod: budget.timePeriod,
        totalSpend: totalSpend.toString(),
        totalItem: totalItem,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching budgets:", error);
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
    const { name, amount, icon, color, createdBy, createdAt, timePeriod } =
      body;

    if (!name || !amount || !color || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(Budgets)
      .values({
        name,
        amount: amount.toString(),
        icon: icon || "💰",
        color,
        createdBy,
        createdAt,
        timePeriod: timePeriod || "monthly",
      })
      .returning({ insertedId: Budgets.id });

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
