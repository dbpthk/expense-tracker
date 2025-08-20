"use client";
import React, { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";
import {
  Loader,
  Calendar,
  TrendingDown,
  TrendingUp,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

const BudgetItem = ({ budget, refreshData }) => {
  const { setReferesh } = useBudget();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editData, setEditData] = useState({
    name: budget.name,
    amount: budget.amount?.toString(),
    icon: budget.icon,
    color: budget.color,
  });

  const deleteBudget = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/budgets/${budget.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Budget deleted successfully!");
        refreshData();
        setReferesh((prev) => prev + 1);
      } else {
        throw new Error("Failed to delete budget");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget");
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async () => {
    if (!editData.name || !editData.amount) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/budgets/${budget.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editData.name,
          amount: parseFloat(editData.amount),
          icon: editData.icon,
          color: editData.color,
        }),
      });

      if (response.ok) {
        toast.success("Budget updated successfully!");
        setEditing(false);
        refreshData();
        setReferesh((prev) => prev + 1);
      } else {
        throw new Error("Failed to update budget");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget");
    } finally {
      setLoading(false);
    }
  };

  const remaining =
    parseFloat(budget.amount || 0) - parseFloat(budget.totalSpend || 0);
  const spendingPercentage =
    (parseFloat(budget.totalSpend || 0) / parseFloat(budget.amount || 1)) * 100;
  const isOverBudget = spendingPercentage > 100;
  const isNearLimit = spendingPercentage > 80;

  return (
    <div
      className="group relative p-6 border rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full"
      style={{ borderColor: budget.color }}
    >
      {/* Background accent */}
      <div
        className="absolute top-0 left-0 w-2 h-full opacity-80"
        style={{ backgroundColor: budget.color }}
      />

      {/* Header Section */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Icon */}
          <div
            className="text-2xl p-3 rounded-full flex items-center justify-center shadow-sm"
            style={{
              backgroundColor: budget.color + "20",
              color: budget.color,
            }}
          >
            {budget.icon || "💰"}
          </div>

          {/* Budget Name */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: budget.color }}
                aria-label="Budget color indicator"
              />
              <h2 className="font-bold text-lg text-gray-800">
                {toTitleCase(budget.name)}
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Budget Category</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {budget.timePeriod === "weekly" ? "📅 Weekly" : "📊 Monthly"}
              </span>
            </div>
            {/* Date created - moved here to avoid overlap */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Calendar className="w-3 h-3" />
              <span>Created: {budget.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right flex-shrink-0">
          <h2 className="font-bold text-2xl" style={{ color: budget.color }}>
            ${parseFloat(budget.amount || 0).toLocaleString()}
          </h2>
          <span className="text-xs text-gray-500">Total Budget</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span className="font-medium">{spendingPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverBudget
                ? "bg-red-500"
                : isNearLimit
                ? "bg-orange-500"
                : "bg-green-500"
            }`}
            style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Spending Info */}
      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-gray-600 flex items-center gap-1">
          <TrendingDown className="w-4 h-4 text-red-500" />$
          {budget.totalSpend?.toLocaleString() ?? 0} spent
        </span>
        <span
          className="font-semibold flex items-center gap-1"
          style={{ color: budget.color }}
        >
          <TrendingUp className="w-4 h-4" />${remaining?.toLocaleString()} left
        </span>
      </div>

      {/* Warning Messages */}
      {isOverBudget && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Budget exceeded by ${Math.abs(remaining).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {isNearLimit && !isOverBudget && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Approaching budget limit ({spendingPercentage.toFixed(1)}%)
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditing(true)}
          className="flex-1 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>

        {/* Delete Budget */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Budget</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                budget "{budget.name}" along with all associated expenses.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteBudget}
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Delete Budget
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Budget Name
              </label>
              <Input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                placeholder="Budget name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Amount
              </label>
              <Input
                type="number"
                value={editData.amount}
                onChange={(e) =>
                  setEditData({ ...editData, amount: e.target.value })
                }
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Icon</label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="mt-1 w-full h-10 text-2xl justify-start"
                >
                  {editData.icon || "💰"}
                </Button>

                {showEmojiPicker && (
                  <div className="absolute z-50 top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(false)}
                        className="absolute top-2 right-2 z-10 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        ×
                      </button>
                      <div style={{ transform: "scale(0.8)" }}>
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            setEditData({ ...editData, icon: emojiData.emoji });
                            setShowEmojiPicker(false);
                          }}
                          searchPlaceholder="Search emojis..."
                          width={300}
                          height={400}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Color</label>
              <Input
                type="color"
                value={editData.color}
                onChange={(e) =>
                  setEditData({ ...editData, color: e.target.value })
                }
                className="mt-1 h-10"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={updateBudget}
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default memo(BudgetItem);
