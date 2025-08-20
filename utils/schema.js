import { integer } from "drizzle-orm/gel-core";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: integer("amount").notNull(),
  icon: varchar("icon"),
  color: varchar("color").notNull(), // 🎨 new column for selected color
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt").notNull(),
  timePeriod: varchar("timePeriod").default("monthly"),
  // Note: totalSpend and updatedAt columns removed as they don't exist in actual database
});

export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: integer("amount").notNull().default(0),
  budgetId: integer("budgetId").references(() => Budgets.id),
  createdAt: varchar("createdAt").notNull(),
  category: varchar("category").notNull(),
  color: varchar("color").notNull(),
});

export const Categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  icon: varchar("icon").notNull(),
  color: varchar("color").notNull(),
  isDefault: integer("isDefault").notNull().default(0), // 0 = custom, 1 = default
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt").notNull(),
});
// UserSettings table removed as per user request to remove currency functionality
