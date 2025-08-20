import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST() {
  try {
    let changes = [];

    // Check current table structures
    const budgetColumns = await db.execute(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'budgets'
      ORDER BY ordinal_position
    `);

    const expenseColumns = await db.execute(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'expenses'
      ORDER BY ordinal_position
    `);

    // Check if budgets.amount is integer and needs to be changed
    const budgetAmount = budgetColumns.rows.find(
      (col) => col.column_name === "amount"
    );
    if (budgetAmount && budgetAmount.data_type === "integer") {
      try {
        await db.execute(
          `ALTER TABLE budgets ALTER COLUMN amount TYPE VARCHAR(20)`
        );
        changes.push("Changed budgets.amount from integer to varchar(20)");
      } catch (e) {
        changes.push(`Failed to change budgets.amount: ${e.message}`);
      }
    }

    // Check if expenses.amount is integer and needs to be changed
    const expenseAmount = expenseColumns.rows.find(
      (col) => col.column_name === "amount"
    );
    if (expenseAmount && expenseAmount.data_type === "integer") {
      try {
        await db.execute(
          `ALTER TABLE expenses ALTER COLUMN amount TYPE VARCHAR(20)`
        );
        changes.push("Changed expenses.amount from integer to varchar(20)");
      } catch (e) {
        changes.push(`Failed to change expenses.amount: ${e.message}`);
      }
    }

    return NextResponse.json({
      message: "Database migration completed",
      changes: changes,
      currentBudgetColumns: budgetColumns.rows,
      currentExpenseColumns: expenseColumns.rows,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        error: "Migration failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
