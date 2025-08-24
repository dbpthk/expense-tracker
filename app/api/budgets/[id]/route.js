import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Budgets, Expenses } from "@/utils/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request, { params }) {
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

    const { id } = params;

    // SECURITY FIX: Only allow access to budgets owned by the authenticated user
    const result = await db
      .select()
      .from(Budgets)
      .where(and(eq(Budgets.id, Number(id)), eq(Budgets.createdBy, userEmail)));

    if (result.length === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    const { id } = params;
    const body = await request.json();
    const { name, amount, icon, color, createdAt } = body;

    if (!name || !amount || !color) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // SECURITY FIX: Only allow updates to budgets owned by the authenticated user
    const result = await db
      .update(Budgets)
      .set({
        name,
        amount: parseFloat(amount),
        icon: icon || "💰",
        color,
        createdAt,
      })
      .where(and(eq(Budgets.id, Number(id)), eq(Budgets.createdBy, userEmail)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Budget not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    const { id } = params;

    // SECURITY FIX: Only allow deletion of budgets owned by the authenticated user
    // First delete all expenses associated with this budget (only user's own expenses)
    try {
      await db
        .delete(Expenses)
        .where(
          and(
            eq(Expenses.budgetId, Number(id)),
            eq(Expenses.createdBy, userEmail)
          )
        );
    } catch (expenseError) {
      console.log(
        "No expenses to delete or error deleting expenses:",
        expenseError
      );
    }

    // Then delete the budget (only if owned by user)
    const result = await db
      .delete(Budgets)
      .where(and(eq(Budgets.id, Number(id)), eq(Budgets.createdBy, userEmail)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Budget not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
