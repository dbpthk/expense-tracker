"use client";
import { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./BudgetItem";
import { Wallet, TrendingUp, Plus } from "lucide-react";

const BudgetList = () => {
  const [budgetList, setBudgetList] = useState(null); // null = loading, [] = no data
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (user && isLoaded) {
      getBudgetList();
    }
  }, [user, isLoaded]);

  const getBudgetList = async () => {
    try {
      const response = await fetch(`/api/budgets`);
      if (response.ok) {
        const result = await response.json();
        setBudgetList(result);
      } else {
        throw new Error("Failed to fetch budgets");
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setBudgetList([]); // treat as no data on error
    }
  };

  if (!isLoaded || budgetList === null) {
    // Loading state: show skeleton cards
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-gray-600">
              Manage your budgets and track spending
            </p>
          </div>
        </div>

        {/* Loading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CreateBudget refreshData={getBudgetList} />
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-48 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const totalBudget = budgetList.reduce(
    (sum, budget) => sum + parseFloat(budget.amount || 0),
    0
  );
  const totalSpent = budgetList.reduce(
    (sum, budget) => sum + parseFloat(budget.totalSpend || 0),
    0
  );
  const remaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-gray-600">
            Manage your budgets and track spending
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 text-sm">
          <div className="text-center p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">
            <div className="font-bold text-blue-700">{budgetList.length}</div>
            <div className="text-blue-600">Budgets</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition-colors">
            <div className="font-bold text-green-700">
              ${totalBudget?.toLocaleString()}
            </div>
            <div className="text-green-600">Total Budget</div>
          </div>
        </div>
      </div>

      {/* Budget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateBudget refreshData={getBudgetList} />

        {budgetList.length === 0 ? (
          // No data state
          <div className="col-span-full">
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Budgets Yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Create your first budget to start tracking your expenses and
                managing your finances effectively.
              </p>
              <div className="text-sm text-gray-400 cursor-pointer">
                Click the "+" card to get started
              </div>
            </div>
          </div>
        ) : (
          // Show budgets
          budgetList.map((budget, index) => (
            <BudgetItem
              budget={budget}
              key={budget.id || index}
              refreshData={getBudgetList}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BudgetList;
