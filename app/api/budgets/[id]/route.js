import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Budgets, Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.id, Number(id)))
      .where(eq(Budgets.createdBy, email));

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

    const { id } = params;
    const body = await request.json();
    const { name, amount, icon, color, createdAt } = body;

    if (!name || !amount || !color) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .update(Budgets)
      .set({
        name,
        amount: parseFloat(amount),
        icon: icon || "💰",
        color,
        createdAt,
      })
      .where(eq(Budgets.id, Number(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
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

    const { id } = params;

    // First delete all expenses associated with this budget
    try {
      await db.delete(Expenses).where(eq(Expenses.budgetId, Number(id)));
    } catch (expenseError) {
      console.log(
        "No expenses to delete or error deleting expenses:",
        expenseError
      );
    }

    // Then delete the budget
    const result = await db
      .delete(Budgets)
      .where(eq(Budgets.id, Number(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
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
