"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";
import moment from "moment";
import {
  Loader,
  Plus,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle,
} from "lucide-react";
import { useBudget } from "@/context/BugetContext";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useUser } from "@clerk/nextjs";
import { useSubscription } from "@/context/SubscriptionContext";
import AIInput from "@/components/ui/ai-input";

const AddExpense = ({ refreshData, refreshExpenses, prefillData }) => {
  const { user } = useUser();
  const { setReferesh } = useBudget();
  const { subscription, canAddExpense } = useSubscription();

  // form states
  const [name, setName] = useState(prefillData?.name || "");
  const [amount, setAmount] = useState(prefillData?.amount?.toString() || "");
  const [expenseDate, setExpenseDate] = useState(
    prefillData?.date || moment().format("YYYY-MM-DD")
  );
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // budget states
  const [budgets, setBudgets] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(null);

  // warning dialog
  const [openWarning, setOpenWarning] = useState(false);

  // fetch budgets for current user
  useEffect(() => {
    const fetchBudgets = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      try {
        const response = await fetch(`/api/budgets`);
        if (response.ok) {
          const result = await response.json();
          setBudgets(result);
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    fetchBudgets();
  }, [user]);

  // set selected budget when dropdown changes
  useEffect(() => {
    if (!selectedBudgetId) return;
    const budget = budgets.find((b) => b.id === Number(selectedBudgetId));
    setSelectedBudget(budget || null);
  }, [selectedBudgetId, budgets]);

  const addExpenseToDB = useCallback(async () => {
    if (!selectedBudget) {
      return;
    }

    if (!canAddExpense()) {
      toast.error("Cannot add expense due to limit");
      return;
    }

    try {
      setLoading(true);

      const requestBody = {
        name,
        amount,
        budgetId: selectedBudget.id,
        createdAt: moment().format("YYYY-MM-DD"),
        category: selectedBudget.name,
        color: selectedBudget.color,
      };

      const response = await fetch(`/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Expense added successfully!");
        setName("");
        setAmount("");
        setSelectedBudget(null);
        refreshData();
        refreshExpenses();
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 4000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error(error.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  }, [
    name,
    amount,
    selectedBudget,
    canAddExpense,
    refreshData,
    refreshExpenses,
  ]);

  const handleAddClick = useCallback(() => {
    if (!name || !amount || !selectedBudget) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!canAddExpense()) {
      toast.error("Cannot add expense due to limit");
      return;
    }

    const newTotal = Number(selectedBudget.totalSpend || 0) + Number(amount);
    if (newTotal > Number(selectedBudget.amount)) {
      setOpenWarning(true);
    } else {
      addExpenseToDB();
    }
  }, [name, amount, selectedBudget, canAddExpense, addExpenseToDB]);

  const onConfirmWarning = () => {
    setOpenWarning(false);
    addExpenseToDB();
  };

  const handleAIDataParsed = (data) => {
    if (data.type === "expense") {
      setName(data.name || "");
      setAmount(data.amount?.toString() || "");
      if (data.date) {
        setExpenseDate(moment(data.date).format("YYYY-MM-DD"));
      }
      // Try to find matching budget by category
      if (data.category) {
        const matchingBudget = budgets.find((b) =>
          b.name.toLowerCase().includes(data.category.toLowerCase())
        );
        if (matchingBudget) {
          setSelectedBudgetId(matchingBudget.id.toString());
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 border p-6 rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl text-gray-800">Add Expense</h2>
        <div className="text-sm text-gray-500">Quick & Easy</div>
      </div>

      {/* AI Input Section */}
      <div className="space-y-4">
        <AIInput onDataParsed={handleAIDataParsed} type="expense" />

        {/* Progress Indicator */}
        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"
              style={{ width: "100%" }}
            ></div>
          </div>
        )}

        {/* Success Indicator */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center transform animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-4">Expense added successfully</p>
              <Button
                onClick={() => setShowSuccess(false)}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Budget Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Tag className="w-4 h-4 text-indigo-600" />
          Select Budget Category
        </label>

        {budgets.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2 font-medium">
              No budgets available
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Create a budget first to add expenses
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard/budgets")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Budget
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {budgets.map((budget) => (
              <button
                key={budget.id}
                onClick={() => setSelectedBudgetId(budget.id.toString())}
                className={`p-4 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                  selectedBudgetId === budget.id.toString()
                    ? "border-blue-500 bg-blue-50 shadow-lg scale-[1.02] ring-2 ring-blue-200"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm"
                    style={{
                      backgroundColor: budget.color + "20",
                      color: budget.color,
                    }}
                  >
                    {budget.icon || "💰"}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {budget.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${budget.amount?.toLocaleString()}
                    </div>
                  </div>
                  {selectedBudgetId === budget.id.toString() && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-600" />
            Expense Name
          </label>
          <Input
            placeholder="Enter Expense"
            onChange={(e) => setName(toTitleCase(e.target.value))}
            value={name}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            Amount
          </label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            max="999999.99"
            placeholder="e.g. 80.50"
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty value and valid numbers
              if (value === "" || !isNaN(parseFloat(value))) {
                setAmount(value);
              }
            }}
            value={amount}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <p className="text-xs text-gray-500">
            Enter amount with up to 2 decimal places (e.g., 50.25)
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            Date
          </label>
          <Input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Budget color preview */}
      {selectedBudget?.color && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div
            className="w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm"
            style={{ backgroundColor: selectedBudget.color }}
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">
              {selectedBudget.name}
            </div>
            <div className="text-xs text-gray-500">
              Budget: ${selectedBudget.amount}
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleAddClick}
        className="w-full py-4 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
        disabled={!(name && amount && selectedBudget) || loading}
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <Loader className="w-5 h-5 animate-spin" />
            <span className="font-medium">Adding Expense...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Expense</span>
          </div>
        )}
      </Button>

      {/* Warning Dialog */}
      <AlertDialog open={openWarning} onOpenChange={setOpenWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning: Budget Exceeded</AlertDialogTitle>
            <AlertDialogDescription>
              Adding this expense will exceed your budget limit of{" "}
              <strong>${selectedBudget?.amount}</strong>. Do you want to
              continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmWarning}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddExpense;
