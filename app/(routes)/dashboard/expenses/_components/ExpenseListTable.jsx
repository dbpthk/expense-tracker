"use client";
import React from "react";
import db from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";

const ExpenseListTable = ({ expensesList, refreshData }) => {
  const deleteExpense = async (expense) => {
    try {
      const result = await db
        .delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result) {
        toast.success("Expense deleted");
        refreshData();
      }
    } catch (error) {
      toast.error("Failed to delete expense");
      console.error("Delete expense error:", error);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-xl mb-3">Latest Expenses</h2>
      <div className="grid grid-cols-4 bg-primary text-white font-bold text-sm md:text-lg p-2 pl-6 rounded-t-md">
        <h2>Name</h2>
        <h2>Amount</h2>
        <h2>Date</h2>
        <h2 className="text-center">Action</h2>
      </div>

      {Array.isArray(expensesList) && expensesList.length > 0
        ? expensesList.slice(0, 5).map((expense) => (
            <div
              key={expense.id}
              className="grid grid-cols-4 gap-5 bg-neutral-background p-2 pl-6 text-sm md:text-base border-b border-gray-200"
            >
              <h2>{toTitleCase(expense.name)}</h2>
              <h2>${expense.amount.toFixed(2)}</h2>
              <h2>{expense.createdAt}</h2>
              <h2 className="flex justify-center">
                <Trash
                  className="text-red-600 h-5 md:h-6 cursor-pointer"
                  onClick={() => deleteExpense(expense)}
                  title="Delete expense"
                  aria-label="Delete expense"
                />
              </h2>
            </div>
          ))
        : Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-4 bg-[#9aecb729] rounded-lg animate-pulse my-1"
            />
          ))}
    </div>
  );
};

export default ExpenseListTable;
