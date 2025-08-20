"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";
import moment from "moment";
import { Loader } from "lucide-react";
import { useBudget } from "@/context/BugetContext";
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

const AddExpense = ({ refreshData, refereshExpenses, prefillData }) => {
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
        const response = await fetch(
          `/api/budgets?email=${user.primaryEmailAddress.emailAddress}`
        );
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

  const addExpenseToDB = async () => {
    if (!selectedBudget) return;

    // Check expense limit for free/trial users
    if (!canAddExpense()) {
      toast.warning("Expense Limit Reached!", {
        description: `You've reached your monthly limit of ${subscription.expenseLimit} expenses. Upgrade to Pro for unlimited expenses.`,
        action: {
          label: "Upgrade",
          onClick: () => (window.location.href = "/dashboard/upgrade"),
        },
      });
      return;
    }

    setLoading(true);
    try {
      const formattedDate = moment(expenseDate).format("DD/MM/YYYY");

      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          amount: Number(amount),
          budgetId: selectedBudget.id,
          createdAt: formattedDate,
          category: selectedBudget.name,
          color: selectedBudget.color,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("New Expense Added!", {
          description: `Added ${name} for $${amount} to ${selectedBudget.name}`,
        });

        // Trigger refresh functions with debounce to prevent multiple calls
        setReferesh((prev) => prev + 1);

        // Use single timeout to handle all refreshes
        setTimeout(() => {
          if (refreshData) refreshData();
          if (refereshExpenses) refereshExpenses();
        }, 150);

        // reset form
        setName("");
        setAmount("");
        setExpenseDate(moment().format("YYYY-MM-DD"));
        setSelectedBudgetId("");
        setSelectedBudget(null);
      } else {
        throw new Error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense.");
    }
    setLoading(false);
  };

  const handleAddClick = () => {
    if (!name || !amount || !selectedBudget) {
      toast.error("Please fill all fields and select a budget.");
      return;
    }

    const newTotal = Number(selectedBudget.totalSpend || 0) + Number(amount);
    if (newTotal > Number(selectedBudget.amount)) {
      setOpenWarning(true);
    } else {
      addExpenseToDB();
    }
  };

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
      <AIInput onDataParsed={handleAIDataParsed} type="expense" />

      {/* Budget Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Select Budget Category
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {budgets.map((budget) => (
            <button
              key={budget.id}
              onClick={() => setSelectedBudgetId(budget.id.toString())}
              className={`p-4 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-md ${
                selectedBudgetId === budget.id.toString()
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
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
                  <div className="font-medium text-gray-900">{budget.name}</div>
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
        {budgets.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-gray-500 mb-2">No budgets available</p>
            <p className="text-sm text-gray-400">
              Create a budget first to add expenses
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Expense Name
          </label>
          <Input
            placeholder="Enter Expense"
            onChange={(e) => setName(toTitleCase(e.target.value))}
            value={name}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Amount</label>
          <Input
            type="number"
            placeholder="e.g. 80"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date</label>
          <Input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="w-full"
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
        className="w-full py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        disabled={!(name && amount && selectedBudget) || loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Adding Expense...</span>
          </div>
        ) : (
          "Add New Expense"
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
