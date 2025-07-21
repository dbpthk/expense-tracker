"use client";
import { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import { useUser } from "@clerk/nextjs";
import { sql } from "drizzle-orm";
import { eq, getTableColumns } from "drizzle-orm";
import db from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import BudgetItem from "./BudgetItem";

const BudgetList = () => {
  const [budgetList, setBudgetList] = useState([]);

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (user && isLoaded) {
      getBudgetList();
    }
  }, [user, isLoaded]);

  const getBudgetList = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`SUM(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id);
      setBudgetList(result);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateBudget />
        {budgetList.map((budget, index) => (
          <BudgetItem
            key={index}
            icon={budget.icon}
            name={budget.name}
            totalItem={budget.totalItem}
            amount={budget.amount}
            totalSpend={budget.totalSpend}
          />
        ))}
      </div>
    </div>
  );
};

export default BudgetList;
