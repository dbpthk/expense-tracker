import db from "@/lib/db";
import { Budgets, Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import moment from "moment";
import { demoBudgets, getDemoExpenses } from "./demoSeed";

const DEMO_USER_EMAIL = process.env.DEMO_USER_EMAIL;

/**
 * Resets demo user data to the initial seed state.
 * - Deletes all existing demo budgets and expenses
 * - Recreates budgets from demoSeed
 * - Recreates expenses with correct budgetId relationships
 *
 * Only affects the user identified by DEMO_USER_EMAIL. Safe for production.
 *
 * @returns {{ success: boolean; budgetsCreated?: number; expensesCreated?: number; error?: string }}
 */
export async function resetDemoData() {
  if (!DEMO_USER_EMAIL) {
    return { success: false, error: "DEMO_USER_EMAIL not configured" };
  }

  try {
    // 1. Delete all expenses created by demo user (must be before budgets due to FK)
    const deletedExpenses = await db
      .delete(Expenses)
      .where(eq(Expenses.createdBy, DEMO_USER_EMAIL));

    // 2. Delete all budgets created by demo user
    const deletedBudgets = await db
      .delete(Budgets)
      .where(eq(Budgets.createdBy, DEMO_USER_EMAIL));

    // 3. Insert demo budgets
    const today = moment().format("YYYY-MM-DD");
    const insertedBudgets = await db
      .insert(Budgets)
      .values(
        demoBudgets.map((b) => ({
          name: b.name,
          amount: b.amount,
          icon: b.icon,
          color: b.color,
          createdBy: DEMO_USER_EMAIL,
          createdAt: today,
          timePeriod: "monthly",
        }))
      )
      .returning();

    // 4. Build budget name -> id map (order matches demoBudgets)
    const budgetIdMap = {};
    insertedBudgets.forEach((b, i) => {
      budgetIdMap[demoBudgets[i].name] = b.id;
    });

    // 5. Insert demo expenses with correct budgetIds
    const demoExpenses = getDemoExpenses(budgetIdMap);
    await db.insert(Expenses).values(
      demoExpenses.map((e) => ({
        name: e.name,
        amount: e.amount,
        budgetId: e.budgetId,
        category: e.category,
        color: e.color,
        createdAt: e.createdAt,
        createdBy: DEMO_USER_EMAIL,
      }))
    );

    return {
      success: true,
      budgetsCreated: insertedBudgets.length,
      expensesCreated: demoExpenses.length,
    };
  } catch (err) {
    console.error("resetDemoData error:", err);
    return {
      success: false,
      error: err?.message || "Failed to reset demo data",
    };
  }
}
