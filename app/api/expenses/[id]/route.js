import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Expenses } from "@/utils/schema";
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

    // SECURITY FIX: Only allow access to expenses owned by the authenticated user
    const result = await db
      .select()
      .from(Expenses)
      .where(
        and(eq(Expenses.id, Number(id)), eq(Expenses.createdBy, userEmail))
      );

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Expense not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching expense:", error);
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
    const { name, amount, createdAt } = body;

    if (!name || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // SECURITY FIX: Only allow updates to expenses owned by the authenticated user
    const result = await db
      .update(Expenses)
      .set({
        name,
        amount: parseFloat(amount),
        createdAt,
      })
      .where(
        and(eq(Expenses.id, Number(id)), eq(Expenses.createdBy, userEmail))
      )
      .returning();

    if (result.length === 0) {
      throw new Error("Expense not found or access denied");
    }

    // Note: totalSpend column update removed temporarily to fix API errors
    // Will be re-enabled once database migration is complete

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating expense:", error);
    if (error.message === "Expense not found or access denied") {
      return NextResponse.json(
        { error: "Expense not found or access denied" },
        { status: 404 }
      );
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

    // SECURITY FIX: Only allow deletion of expenses owned by the authenticated user
    const result = await db
      .delete(Expenses)
      .where(
        and(eq(Expenses.id, Number(id)), eq(Expenses.createdBy, userEmail))
      )
      .returning();

    if (result.length === 0) {
      throw new Error("Expense not found or access denied");
    }

    // Note: totalSpend column update removed temporarily to fix API errors
    // Will be re-enabled once database migration is complete

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    if (error.message === "Expense not found or access denied") {
      return NextResponse.json(
        { error: "Expense not found or access denied" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
