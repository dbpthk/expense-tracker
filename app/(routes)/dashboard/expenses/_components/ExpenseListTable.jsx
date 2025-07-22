"use client";
import db from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";

const ExpenseListTable = ({ expensesList, refereshData }) => {
  const deleteExpense = async (expense) => {
    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, expense.id))
      .returning();
    if (result) {
      toast("Expense deleted");
      refereshData();
    }
  };
  return (
    <div className="mt-3">
      <div className="grid grid-cols-4 bg-primary text-white font-bold text-sm md:text-lg p-2 pl-6">
        <h2>Name</h2>
        <h2>Amount</h2>
        <h2>Date</h2>
        <h2>Action</h2>
      </div>
      {Array.isArray(expensesList) && expensesList.length > 0
        ? expensesList.map((expense, index) => (
            <div
              key={expense.id || index}
              className="grid grid-cols-4 bg-neutral-background p-2 pl-6 text-sm md:text-medium"
            >
              <h2>{toTitleCase(expense.name)}</h2>
              <h2>{expense.amount}</h2>
              <h2>{expense.createdAt}</h2>
              <h2>
                <Trash
                  className="text-red-600 h-[18px] md:h-[25px] cursor-pointer"
                  onClick={() => deleteExpense(expense)}
                />
              </h2>
            </div>
          ))
        : Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-[12px] bg-[#9aecb729] rounded-lg animate-pulse"
            ></div>
          ))}
    </div>
  );
};

export default ExpenseListTable;
