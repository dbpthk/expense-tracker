"use client";
import { UserButton, useUser } from "@clerk/nextjs";

import React, { useEffect, useState } from "react";
import CardInfo from "./_components/CardInfo";
import db from "@/utils/dbConfig";
import { sql } from "drizzle-orm";
import { eq, desc, getTableColumns } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";

const Dashboard = () => {
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
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));
      setBudgetList(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };
  return (
    <div className="p-8">
      <h2 className="font-bold text-3xl">Hi, {user?.fullName}</h2>
      <p className="text-gray-500">
        Here’s what’s happening with your money — let’s take control.
      </p>
      <CardInfo budgetList={budgetList} />
    </div>
  );
};

export default Dashboard;
