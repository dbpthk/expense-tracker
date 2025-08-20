"use client";
import React from "react";
import { Trash, Receipt, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";

const ExpenseListTable = ({ expensesList, refreshData }) => {
  const deleteExpense = async (expense) => {
    try {
      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Expense deleted successfully!");
        refreshData();
      } else {
        throw new Error("Failed to delete expense");
      }
    } catch (error) {
      toast.error("Failed to delete expense");
      console.error("Delete expense error:", error);
    }
  };
  const isLoading = !expensesList; // or expensesList === undefined || expensesList === null
  const isEmpty = Array.isArray(expensesList) && expensesList.length === 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-blue-600" />
          Latest Expenses
        </h2>
        <p className="text-sm text-gray-600 mt-1">Track your recent spending</p>
      </div>

      {isLoading ? (
        // Loading skeleton
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        // No data message
        <div className="text-center p-12 text-gray-500">
          <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-2">
            No expenses yet
          </p>
          <p className="text-sm text-gray-500">
            Start tracking your spending by adding your first expense!
          </p>
        </div>
      ) : (
        // Show expense rows
        <div className="divide-y divide-gray-100">
          {expensesList.slice(0, 5).map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                  style={{
                    backgroundColor: expense.color + "20",
                    color: expense.color,
                  }}
                >
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {toTitleCase(expense.name)}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {expense.createdAt}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    ${expense.amount?.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {expense.category}
                  </div>
                </div>

                <button
                  onClick={() => deleteExpense(expense)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete expense"
                  aria-label="Delete expense"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ExpenseListTable;
