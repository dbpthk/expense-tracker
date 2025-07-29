"use client";
import { UserButton, useUser } from "@clerk/nextjs";

import React, { useEffect, useState } from "react";
import CardInfo from "./_components/CardInfo";
import db from "@/utils/dbConfig";
import { sql } from "drizzle-orm";
import { eq, desc, getTableColumns } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import PieChartDashboard from "./_components/PieChartDashboard";

const Dashboard = () => {
  const [budgetList, setBudgetList] = useState([]);
  const { user, isLoaded } = useUser();
  const [expensesList, setExpensesList] = useState([]);

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
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));
      setBudgetList(result);
      getAllExpenses();
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  // get all expenses belong to users
  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        budgetId: Expenses.budgetId,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };
  return (
    <div className="pt-15 p-8 flex flex-col gap-7">
      <div>
        <h2 className="font-bold text-3xl">Hi, {user?.fullName}</h2>
        <p className="text-gray-500">
          Here’s what’s happening with your money — let’s take control.
        </p>
      </div>
      <CardInfo budgetList={budgetList} />
      <div className="flex flex-col">
        <div className="md:col-span-2 ">
          <div className="flex flex-col gap-5">
            <BarChartDashboard budgetList={budgetList} />
            <PieChartDashboard
              budgetList={budgetList}
              expensesList={expensesList}
            />
            <div>
              <ExpenseListTable
                expensesList={expensesList}
                refereshData={() => getBudgetList()}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {/* only showing recent 4 budget lists */}
          {budgetList.slice(0, 4).map((budget, index) => (
            <div key={index || budget.id}>
              <BudgetItem
                id={budget.id}
                icon={budget.icon}
                name={budget.name}
                totalItem={budget.totalItem}
                amount={budget.amount}
                totalSpend={budget.totalSpend}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
