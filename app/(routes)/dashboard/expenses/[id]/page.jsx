"use client";
import { sql, eq, and, getTableColumns } from "drizzle-orm";
import db from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "../../budgets/_components/BudgetItem";

const ExpenseItem = ({ params }) => {
  const { user, isLoaded } = useUser();
  const [budgetInfo, setBudgetInfo] = useState(null);

  useEffect(() => {
    if (user && isLoaded) {
      getBudgetInfo();
    }
  }, [user, isLoaded]);

  const getBudgetInfo = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`SUM(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(
          and(
            eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress),
            eq(Budgets.id, params.id)
          )
        )
        .groupBy(Budgets.id);

      console.log("Budget Info:", result);
      setBudgetInfo(result[0]);
    } catch (error) {
      console.error("Error fetching budget info:", error);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">My Expenses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6">
        {budgetInfo ? (
          <BudgetItem
            id={budgetInfo.id}
            name={budgetInfo.name}
            icon={budgetInfo.icon}
            totalItem={budgetInfo.totalItem}
            amount={budgetInfo.amount}
            totalSpend={budgetInfo.totalSpend}
          />
        ) : (
          <div className="w-full h-[160px] bg-[#9aecb729] rounded-lg animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default ExpenseItem;
