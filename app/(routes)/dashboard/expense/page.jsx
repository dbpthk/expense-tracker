"use client";
import React from "react";
import ExpenseListTable from "../expenses/_components/ExpenseListTable";
import { useBudget } from "@/context/BugetContext";
import CardInfo from "../_components/CardInfo";
import PieChartDashboard from "../_components/PieChartDashboard";

const Expense = () => {
  const { budgetList, expensesList, user, getBudgetList } = useBudget();

  return (
    <div className="flex flex-col gap-10 p-5 w-full">
      <ExpenseListTable
        expensesList={expensesList}
        refereshData={() => getBudgetList()}
      />
      <CardInfo budgetList={budgetList} />
      <PieChartDashboard expensesList={expensesList} />
    </div>
  );
};

export default Expense;
