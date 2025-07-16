// utils/schema.js
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const budgets = pgTable("budget", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});
