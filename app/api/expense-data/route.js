import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Expenses, Budgets } from "@/utils/schema";
import { eq, desc, inArray, and } from "drizzle-orm";

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

    // Get all budgets for the authenticated user
    const budgets = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, userEmail))
      .orderBy(desc(Budgets.id));

    // SECURITY FIX: Only get expenses that belong to user's budgets
    const userBudgetIds = budgets.map((b) => b.id);

    let expenses = [];
    if (userBudgetIds.length > 0) {
      expenses = await db
        .select()
        .from(Expenses)
        .where(
          and(
            inArray(Expenses.budgetId, userBudgetIds),
            eq(Expenses.createdBy, userEmail) // SECURITY: Only user's own expenses
          )
        )
        .orderBy(desc(Expenses.id));
    }

    // Create category mapping from budgets
    const categoryMap = {};
    budgets.forEach((budget) => {
      categoryMap[budget.name] = {
        icon: budget.icon || "💰",
        color: budget.color || "#3B82F6",
        budgetId: budget.id,
        isDefault: false,
      };
    });

    // Add some default categories if none exist
    if (Object.keys(categoryMap).length === 0) {
      categoryMap["General"] = {
        icon: "💰",
        color: "#3B82F6",
        budgetId: null,
        isDefault: true,
      };
    }

    // Process expenses with category info
    const processedExpenses = expenses.map((expense) => {
      const categoryInfo = categoryMap[expense.category] || {
        icon: "❓",
        color: "#6B7280",
        budgetId: expense.budgetId,
        isDefault: false,
      };

      return {
        id: expense.id,
        name: expense.name,
        amount: expense.amount,
        createdAt: expense.createdAt,
        budgetId: expense.budgetId,
        category: expense.category,
        color: expense.color || categoryInfo.color,
        categoryIcon: categoryInfo.icon,
        categoryColor: categoryInfo.color,
      };
    });

    // Calculate totals
    const totalBudget = budgets.reduce(
      (sum, budget) => sum + parseFloat(budget.amount || 0),
      0
    );
    const totalSpent = expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount || 0),
      0
    );

    return NextResponse.json({
      budgets,
      expenses: processedExpenses,
      categories: categoryMap,
      totals: {
        totalBudget: totalBudget.toString(),
        totalSpent: totalSpent.toString(),
        totalBudgets: budgets.length,
        totalExpenses: expenses.length,
      },
    });
  } catch (error) {
    console.error("Error fetching expense data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
