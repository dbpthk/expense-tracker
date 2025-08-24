import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Budgets, Expenses } from "@/utils/schema";
import { eq, desc, and, inArray } from "drizzle-orm";

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

    // SECURITY FIX: Only get budgets owned by the authenticated user
    const budgets = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, userEmail))
      .orderBy(desc(Budgets.id));

    // SECURITY FIX: Only get expenses for user's budgets
    const userBudgetIds = budgets.map((b) => b.id);

    let expenses = [];
    if (userBudgetIds.length > 0) {
      expenses = await db
        .select({
          budgetId: Expenses.budgetId,
          amount: Expenses.amount,
        })
        .from(Expenses)
        .where(
          and(
            inArray(Expenses.budgetId, userBudgetIds),
            eq(Expenses.createdBy, userEmail) // SECURITY: Only user's own expenses
          )
        );
    }

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
    const { name, amount, icon, color, createdAt, timePeriod } = body;

    if (!name || !amount || !color) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // SECURITY FIX: Always use the authenticated user's email, ignore any createdBy from request
    const result = await db
      .insert(Budgets)
      .values({
        name,
        amount: amount.toString(),
        icon: icon || "💰",
        color,
        createdBy: userEmail, // SECURITY: Always use authenticated user's email
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
