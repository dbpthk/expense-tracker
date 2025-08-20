import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function PUT(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, amount, createdAt } = body;

    if (!name || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the expense
    const result = await db
      .update(Expenses)
      .set({
        name,
        amount: Number(amount),
        createdAt,
      })
      .where(eq(Expenses.id, Number(id)))
      .returning();

    if (result.length === 0) {
      throw new Error("Expense not found");
    }

    // Note: totalSpend column update removed temporarily to fix API errors
    // Will be re-enabled once database migration is complete

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating expense:", error);
    if (error.message === "Expense not found") {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
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

    // Delete the expense
    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, Number(id)))
      .returning();

    if (result.length === 0) {
      throw new Error("Expense not found");
    }

    // Note: totalSpend column update removed temporarily to fix API errors
    // Will be re-enabled once database migration is complete

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    if (error.message === "Expense not found") {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
