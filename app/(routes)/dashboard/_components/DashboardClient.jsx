"use client";
import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useBudget } from "@/context/BugetContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, TrendingUp, ArrowRight, Receipt, Sparkles } from "lucide-react";
import BudgetItem from "../budgets/_components/BudgetItem";
import AddExpense from "../expenses/_components/AddExpense";
import CreateBudget from "../budgets/_components/CreateBudget";
import AIInput from "@/components/ui/ai-input";
import CardInfo from "./CardInfo";
import BarChartDashboard from "./BarChartDashboard";
import PieChartDashboard from "./PieChartDashboard";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";

const DashboardClient = () => {
  const {
    budgetList,
    expensesList,
    user,
    getBudgetList,
    isLoaded,
    isLoading: contextLoading,
  } = useBudget();
  const [aiParsedData, setAiParsedData] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized recent budgets to prevent unnecessary re-renders
  const recentBudgets = useMemo(() => budgetList.slice(0, 4), [budgetList]);

  // Memoized recent expenses to prevent unnecessary re-renders
  const recentExpenses = useMemo(
    () => expensesList.slice(0, 5),
    [expensesList]
  );

  // Optimized loading effect - only run once when user loads
  useEffect(() => {
    if (!user || !isLoaded) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        await getBudgetList();
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        // Reduced delay for better responsiveness
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    loadData();
  }, [user, isLoaded]); // Removed getBudgetList to prevent infinite refresh loop

  const handleAIDataParsed = useCallback((data, type) => {
    setAiParsedData(data);
    if (type === "expense") {
      setShowExpenseForm(true);
    } else if (type === "budget") {
      setShowBudgetForm(true);
    }
  }, []);

  const handleFormClose = useCallback(() => {
    setShowExpenseForm(false);
    setShowBudgetForm(false);
    setAiParsedData(null);
    // Only refresh if data actually changed (forms will handle their own refresh)
  }, []);

  // Show loading skeleton while data is being fetched
  if (isLoading || contextLoading || !user || !isLoaded) {
    return (
      <div className="pt-15 p-4 md:p-8 pb-20">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="pt-15 p-4 sm:p-6 md:p-8 pb-20 max-w-7xl mx-auto">
      {/* AI Quick Actions Section */}
      {budgetList && budgetList.length > 0 ? (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            <h3 className="text-lg md:text-xl font-bold text-gray-800">
              AI Quick Actions
            </h3>
          </div>
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
            Use natural language to quickly add expenses or create budgets. Just
            describe what you want to track!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                <Plus className="w-4 h-4 text-green-600" />
                Quick Expense
              </h4>
              <AIInput
                onDataParsed={(data) => handleAIDataParsed(data, "expense")}
                type="expense"
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Quick Budget
              </h4>
              <AIInput
                onDataParsed={(data) => handleAIDataParsed(data, "budget")}
                type="budget"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            <h3 className="text-lg md:text-xl font-bold text-gray-600">
              AI Quick Actions
            </h3>
          </div>
          <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">
            AI-powered expense and budget parsing will be available once you
            create your first budget.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-800">
                  Create Your First Budget
                </h4>
                <p className="text-sm text-blue-700">
                  Start by creating a budget category to unlock AI-powered
                  expense tracking and insights!
                </p>
              </div>
              <Button
                onClick={() => (window.location.href = "/dashboard/budgets")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Budget
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Latest Expenses Section */}
      {expensesList && expensesList.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Latest Expenses
            </h2>
            <a
              href="/dashboard/expense"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: expense.color + "20",
                      color: expense.color,
                    }}
                  >
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {expense.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {expense.category}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    ${parseFloat(expense.amount || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {expense.createdAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {budgetList && budgetList.length > 0 && (
        <CardInfo budgetList={budgetList} />
      )}

      {/* Charts Section */}
      {budgetList && budgetList.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 mt-8 sm:mb-8">
          <BarChartDashboard budgetList={budgetList} />
          <PieChartDashboard
            budgetList={budgetList}
            expensesList={expensesList}
          />
        </div>
      )}

      {/* Latest Budgets Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg sm:text-xl text-gray-800">
            Latest Budgets
          </h2>
          <a
            href="/dashboard/budgets"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Budget Grid */}
        <div className="grid grid-cols-1 gap-4">
          {recentBudgets && recentBudgets.length > 0 ? (
            recentBudgets.map((budget, index) => (
              <div key={budget.id || index}>
                <BudgetItem
                  budget={budget}
                  key={budget.id || index}
                  refreshData={getBudgetList}
                />
              </div>
            ))
          ) : budgetList && budgetList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Budgets Available
              </h3>
              <p className="text-gray-500 mb-4 max-w-sm mx-auto">
                You haven't created any budgets yet. Create your first budget to
                start managing your finances.
              </p>
              <Button
                onClick={() => (window.location.href = "/dashboard/budgets")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Budget
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading budgets...</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Parsed Data Forms */}
      {aiParsedData && (
        <>
          {/* Expense Form Dialog */}
          <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Add New Expense
                </DialogTitle>
              </DialogHeader>
              <AddExpense
                refreshData={handleFormClose}
                refreshExpenses={handleFormClose}
                prefillData={aiParsedData}
              />
            </DialogContent>
          </Dialog>

          {/* Budget Form Dialog */}
          <Dialog open={showBudgetForm} onOpenChange={setShowBudgetForm}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Create New Budget
                </DialogTitle>
              </DialogHeader>
              <CreateBudget
                refreshData={handleFormClose}
                prefillData={aiParsedData}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default memo(DashboardClient);
