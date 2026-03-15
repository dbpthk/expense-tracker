/**
 * Demo seed data for recruiters - represents the default demo dashboard state.
 * Uses random dates within the current month for expenses.
 */

const getRandomDateInMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  const date = new Date(year, month, day);
  return date.toISOString().split("T")[0];
};

/** @type {Array<{ name: string; amount: string; icon: string; color: string }>} */
export const demoBudgets = [
  { name: "Groceries", amount: "1500", icon: "🛒", color: "#10B981" },
  { name: "Entertainment", amount: "250", icon: "🎬", color: "#8B5CF6" },
  { name: "Transport", amount: "350", icon: "🚗", color: "#3B82F6" },
  { name: "Health and Fitness", amount: "300", icon: "💪", color: "#EF4444" },
];

/** Static schema for demo expenses (name, amount, budgetName, color). Use getDemoExpenses(budgetIdMap) for insert. */
export const demoExpensesSchema = [
  { name: "Coles", amount: "180", budgetName: "Groceries", color: "#10B981" },
  { name: "Costco", amount: "300", budgetName: "Groceries", color: "#10B981" },
  { name: "Netflix", amount: "20", budgetName: "Entertainment", color: "#8B5CF6" },
  { name: "Hoyts", amount: "100", budgetName: "Entertainment", color: "#8B5CF6" },
  { name: "Petrol", amount: "150", budgetName: "Transport", color: "#3B82F6" },
  { name: "Supplements", amount: "100", budgetName: "Health and Fitness", color: "#EF4444" },
  { name: "Gym", amount: "80", budgetName: "Health and Fitness", color: "#EF4444" },
];

/**
 * Demo expenses - budgetName maps to demoBudgets by name.
 * Each expense gets a random date in the current month.
 * @param {Record<string, number>} budgetIdMap - Map of budget name to budget id (set at runtime)
 * @returns {Array<{ name: string; amount: string; budgetId: number; category: string; color: string; createdAt: string }>}
 */
export const getDemoExpenses = (budgetIdMap) => {
  return demoExpensesSchema.map((e) => ({
    name: e.name,
    amount: e.amount,
    budgetId: budgetIdMap[e.budgetName],
    category: e.budgetName,
    color: e.color,
    createdAt: getRandomDateInMonth(),
  }));
};
