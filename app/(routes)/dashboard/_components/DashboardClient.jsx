"use client";
import React, { useState, useEffect, memo, useCallback } from "react";
import CardInfo from "./CardInfo";
import BarChartDashboard from "./BarChartDashboard";
import BudgetItem from "../budgets/_components/BudgetItem";
import ExpenseListTable from "../expenses/_components/ExpenseListTable";
import PieChartDashboard from "./PieChartDashboard";
import { useBudget } from "@/context/BugetContext";
import AIInput from "@/components/ui/ai-input";
import {
  Plus,
  Sparkles,
  TrendingUp,
  Wallet,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddExpense from "../expenses/_components/AddExpense";
import CreateBudget from "../budgets/_components/CreateBudget";

const DashboardClient = () => {
  const { budgetList, expensesList, user, getBudgetList } = useBudget();
  const [aiParsedData, setAiParsedData] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  useEffect(() => {
    getBudgetList();
  }, []);

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
    getBudgetList(); // Refresh data
  }, [getBudgetList]);

  return (
    <div className="pt-15 p-4 md:p-8 pb-20 flex flex-col gap-8">
      {/* First Time Setup */}
      {/* <FirstTimeSetup /> */}
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <div className="p-2 md:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
            <Wallet className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="font-bold text-2xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Expense Tracker
          </h1>
        </div>
        <h2 className="font-bold text-xl md:text-2xl">
          Hi, {user?.fullName}! 👋
        </h2>
        <p className="text-sm md:text-base text-gray-600 tracking-wide max-w-2xl mx-auto px-4">
          Take control of your finances with AI-powered insights and smart
          tracking.
        </p>
      </div>

      {/* AI Quick Actions Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 md:p-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm md:text-base">
              <Plus className="w-4 h-4 text-green-600" />
              Quick Expense
            </h4>
            <AIInput
              onDataParsed={(data) => handleAIDataParsed(data, "expense")}
              type="expense"
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm md:text-base">
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

      {/* Latest Expenses Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Latest Expenses</h2>
          <a
            href="/dashboard/expenses"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {expensesList.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-gray-500">
              No expenses yet. Add your first expense to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {expensesList.slice(0, 5).map((expense) => (
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
                    ${expense.amount?.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {expense.createdAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <CardInfo budgetList={budgetList} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarChartDashboard budgetList={budgetList} />
        <PieChartDashboard
          budgetList={budgetList}
          expensesList={expensesList}
        />
      </div>

      {/* Latest Budgets Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl text-gray-800">Latest Budgets</h2>
          <a
            href="/dashboard/budgets"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Budget Grid */}
        <div className="grid grid-cols-1 gap-4">
          {budgetList.slice(0, 4).map((budget, index) => (
            <div key={budget.id || index}>
              <BudgetItem
                budget={budget}
                key={budget.id || index}
                refreshData={getBudgetList}
              />
            </div>
          ))}
        </div>

        {budgetList.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Budgets Yet
            </h3>
            <p className="text-gray-500 mb-4 max-w-sm mx-auto">
              Create your first budget to start tracking your expenses and
              managing your finances effectively.
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard/budgets")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Budget
            </Button>
          </div>
        )}
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
                refereshExpenses={handleFormClose}
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
