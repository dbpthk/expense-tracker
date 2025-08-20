import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // Test basic database connection
    const result = await db.execute("SELECT 1 as test");

    // Check what tables exist
    const tables = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    // Check the structure of the budgets table
    const budgetColumns = await db.execute(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'budgets' 
      ORDER BY ordinal_position
    `);

    // Check the structure of the expenses table
    const expenseColumns = await db.execute(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'expenses' 
      ORDER BY ordinal_position
    `);

    return NextResponse.json({
      message: "Database connection successful",
      result: result.rows,
      tables: tables.rows,
      budgetColumns: budgetColumns.rows,
      expenseColumns: expenseColumns.rows,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        error: "Database connection failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
