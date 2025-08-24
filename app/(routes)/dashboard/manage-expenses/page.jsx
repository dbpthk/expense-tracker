"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import AddExpense from "../expenses/_components/AddExpense";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ArrowLeft,
  Receipt,
  TrendingUp,
  AlertCircle,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Target,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import moment from "moment";
import { useBudget } from "@/context/BugetContext";

const ManageExpenses = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { budgetList, getBudgetList } = useBudget();

  const [selectedBudget, setSelectedBudget] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    if (user && isLoaded) {
      getBudgetList();
    }
  }, [user, isLoaded]);

  useEffect(() => {
    if (selectedBudget) {
      getExpensesList();
    }
  }, [selectedBudget]);

  const getExpensesList = async () => {
    if (!selectedBudget) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/expenses?email=${user?.primaryEmailAddress?.emailAddress}`
      );
      if (response.ok) {
        const allExpenses = await response.json();
        const budgetExpenses = allExpenses.filter(
          (expense) => expense.budgetId === selectedBudget.id
        );
        setExpensesList(budgetExpenses);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const editExpense = (expense) => {
    setEditingExpense(expense);
    setEditDialogOpen(true);
  };

  const updateExpense = async (updatedData) => {
    try {
      const response = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        toast.success("Expense updated successfully!");
        setEditDialogOpen(false);
        setEditingExpense(null);
        getExpensesList();
      } else {
        throw new Error("Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense");
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Expense deleted successfully!");
        getExpensesList();
      } else {
        throw new Error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const handleAddExpense = () => {
    setShowAddExpense(true);
  };

  const handleExpenseAdded = () => {
    setShowAddExpense(false);
    getExpensesList();

    // Force a complete refresh of budget data with updated totals
    getBudgetList(true); // Pass true to force refresh

    // Also refresh the selected budget to show updated totals
    if (selectedBudget) {
      // Force a re-render by updating the selected budget
      setSelectedBudget({ ...selectedBudget });
    }

    // Force a complete re-fetch of budgets to get updated totalSpend
    setTimeout(() => {
      const refreshBudgets = async () => {
        try {
          const response = await fetch(
            `/api/budgets?email=${user?.primaryEmailAddress?.emailAddress}`
          );
          if (response.ok) {
            const result = await response.json();
            // Find and update the selected budget with fresh data
            if (selectedBudget) {
              const updatedBudget = result.find(
                (b) => b.id === selectedBudget.id
              );
              if (updatedBudget) {
                setSelectedBudget(updatedBudget);
              }
            }
            // Force a complete refresh of the context data
            getBudgetList(true);
          }
        } catch (error) {
          console.error("Error refreshing budgets:", error);
        }
      };
      refreshBudgets();
    }, 200);
  };

  if (!user || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!selectedBudget) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Manage Expenses</h1>
          <p className="text-gray-600 mt-2">
            Select a budget to manage its expenses
          </p>
        </div>

        {budgetList.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              No Budgets Available
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to create a budget first before you can manage expenses.
            </p>
            <Button
              onClick={() => router.push("/dashboard/budgets")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Budget
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetList.map((budget) => (
              <div
                key={budget.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedBudget(budget)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      backgroundColor: budget.color + "20",
                      color: budget.color,
                    }}
                  >
                    {budget.icon || "💰"}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {budget.name}
                    </h3>
                    <p className="text-sm text-gray-500">Budget Category</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Budget</span>
                    <span
                      className="font-bold text-lg"
                      style={{ color: budget.color }}
                    >
                      ${budget.amount?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Spent</span>
                    <span className="font-semibold text-red-600">
                      ${budget.totalSpend?.toLocaleString() || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="font-semibold text-green-600">
                      $
                      {(
                        budget.amount - (budget.totalSpend || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBudget(budget);
                    }}
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Manage Expenses
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => setSelectedBudget(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Budgets
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{
                backgroundColor: selectedBudget.color + "20",
                color: selectedBudget.color,
              }}
            >
              {selectedBudget.icon || "💰"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedBudget.name}
              </h1>
              <p className="text-gray-600">Budget Management</p>
            </div>
          </div>

          {/* Budget Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                ${selectedBudget.amount?.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">Total Budget</div>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">
                ${selectedBudget.totalSpend?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-red-600">Total Spent</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                $
                {(
                  selectedBudget.amount - (selectedBudget.totalSpend || 0)
                ).toLocaleString()}
              </div>
              <div className="text-sm text-green-600">Remaining</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Budget Progress</span>
              <span className="font-medium">
                {(
                  ((selectedBudget.totalSpend || 0) / selectedBudget.amount) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  (selectedBudget.totalSpend || 0) > selectedBudget.amount
                    ? "bg-red-500"
                    : (selectedBudget.totalSpend || 0) >
                      selectedBudget.amount * 0.8
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min(
                    ((selectedBudget.totalSpend || 0) / selectedBudget.amount) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Add New Expense
                  </DialogTitle>
                </DialogHeader>
                <AddExpense
                  refreshData={handleExpenseAdded}
                  refreshExpenses={handleExpenseAdded}
                  prefillData={null}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Expenses</h2>
          <span className="text-sm text-gray-500">
            {expensesList.length} expense{expensesList.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading expenses...</p>
          </div>
        ) : expensesList.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Expenses Yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Add your first expense to start tracking your spending in this
              budget.
            </p>
            <Button
              onClick={handleAddExpense}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Expense
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {expensesList.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{
                      backgroundColor: selectedBudget.color + "20",
                      color: selectedBudget.color,
                    }}
                  >
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {expense.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{expense.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">
                      ${parseFloat(expense.amount || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {expense.category || "General"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editExpense(expense)}
                      className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Expense Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <EditExpenseForm
            expense={editingExpense}
            onSave={updateExpense}
            onCancel={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Edit Expense Form Component
const EditExpenseForm = ({ expense, onSave, onCancel }) => {
  const [name, setName] = useState(expense?.name || "");
  const [amount, setAmount] = useState(expense?.amount?.toString() || "");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (expense?.createdAt) {
      // Convert date from DD/MM/YYYY to YYYY-MM-DD for input
      let dateForInput;
      try {
        if (expense.createdAt.includes("/")) {
          // If date is in DD/MM/YYYY format
          dateForInput = moment(expense.createdAt, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          );
        } else {
          // If date is already in ISO format or other format
          dateForInput = moment(expense.createdAt).format("YYYY-MM-DD");
        }
      } catch (error) {
        // Fallback to today's date if parsing fails
        dateForInput = moment().format("YYYY-MM-DD");
      }
      setDate(dateForInput);
    } else {
      setDate(moment().format("YYYY-MM-DD"));
    }
  }, [expense]);

  const handleSave = () => {
    if (!name || !amount) {
      toast.error("Please fill all required fields");
      return;
    }
    // Convert date back to DD/MM/YYYY format for saving
    const dateToSave = moment(date).format("DD/MM/YYYY");
    onSave({ name, amount: Number(amount), createdAt: dateToSave });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">
          Expense Name
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Expense name"
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Amount</label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Date</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave} className="flex-1">
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ManageExpenses;
