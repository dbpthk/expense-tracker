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
import { useBudget } from "@/context/BugetContext";

const Dashboard = () => {
  const { budgetList, expensesList, user, getBudgetList } = useBudget();

  return (
    <div className="pt-15 p-8 flex flex-col gap-7">
      <div>
        <h2 className="font-bold text-3xl">Hi, {user?.fullName}</h2>
        <p className="text-gray-500">
          Here’s what’s happening with your money — let’s take control.
        </p>
      </div>
      <CardInfo budgetList={budgetList} />
      <div className="flex flex-col gap-10">
        <div className="md:col-span-2">
          <div className=" flex flex-col gap-10">
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
