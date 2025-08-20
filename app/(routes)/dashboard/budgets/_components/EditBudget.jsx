"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";
import moment from "moment";

// Use the same color options as CreateBudget
const colorOptions = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#FACC15",
  "#8B5CF6",
  "#F97316",
  "#14B8A6",
  "#EC4899",
  "#6366F1",
  "#6B7280",
  "#84CC16",
  "#06B6D4",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

const EditBudget = ({ budget, budgetInfo, refreshData }) => {
  const [emoji, setEmoji] = useState("");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [color, setColor] = useState();
  const [customDate, setCustomDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (budgetInfo) {
      setEmoji(budgetInfo?.icon);
      setBudgetName(budgetInfo?.name);
      setBudgetAmount(budgetInfo?.amount);
      setColor(budgetInfo?.color || colorOptions[0]);

      if (budgetInfo?.createdAt) {
        const parsed = moment(budgetInfo.createdAt, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        );
        setCustomDate(parsed);
      }
    }
  }, [budgetInfo]);

  const onUpdateBudget = async () => {
    if (isLoading) return; // Prevent double submission

    setIsLoading(true);
    const dateToSave = customDate
      ? moment(customDate).format("DD/MM/YYYY")
      : moment().format("DD/MM/YYYY");

    try {
      const response = await fetch(`/api/budgets/${budgetInfo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: budgetName,
          amount: budgetAmount,
          icon: emoji,
          color: color,
          createdAt: dateToSave,
        }),
      });

      if (response.ok) {
        toast.success("Budget updated successfully!");
        setIsOpen(false); // Close dialog
        // Optimistic update with small delay for better UX
        setTimeout(() => {
          refreshData();
        }, 100);
      } else {
        throw new Error("Failed to update budget");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            style={{ backgroundColor: budget.color }}
            className="cursor-pointer flex items-center gap-2 text-white px-4 py-2 rounded-xl shadow-md hover:opacity-90 transition"
          >
            <PenBox className="h-4 w-4" /> Edit
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:m-10 md:max-w-lg rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              ✏️ Update Budget
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Modify the details of your budget below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Emoji & Color Row */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="cursor-pointer text-3xl flex items-center justify-center rounded-full border shadow-sm hover:scale-105 transition"
                onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              >
                {emoji || "😀"}
              </Button>

              {color && (
                <div
                  className="w-10 h-10 rounded-full border-2 shadow-inner"
                  style={{ backgroundColor: color }}
                  aria-label="Selected budget color"
                />
              )}
            </div>

            {openEmojiPicker && (
              <div className="absolute z-20 left-1/2 -translate-x-1/2 mt-2">
                <div style={{ transform: "scale(0.8)" }}>
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setEmoji(emojiData.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Color Picker */}
            <div>
              <h2 className="text-sm font-semibold mb-2 text-gray-800">
                🎨 Choose Color
              </h2>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      color === c ? "ring-2 ring-black" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Budget Name */}
            <div>
              <h2 className="text-sm font-semibold mb-1 text-gray-800">
                📌 Budget Name
              </h2>
              <Input
                placeholder="e.g. Grocery"
                value={budgetName}
                className="rounded-lg"
                onChange={(e) => setBudgetName(toTitleCase(e.target.value))}
              />
            </div>

            {/* Budget Amount */}
            <div>
              <h2 className="text-sm font-semibold mb-1 text-gray-800">
                💰 Budget Amount
              </h2>
              <Input
                type="number"
                placeholder="e.g. 500"
                className="rounded-lg"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
              />
            </div>

            {/* Custom Date */}
            <div>
              <h2 className="text-sm font-semibold mb-1 text-gray-800">
                📅 Custom Date
              </h2>
              <Input
                type="date"
                value={customDate}
                className="rounded-lg"
                onChange={(e) => setCustomDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              disabled={!(budgetName && budgetAmount) || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium py-2 rounded-xl shadow hover:opacity-90 transition disabled:opacity-50"
              onClick={onUpdateBudget}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </div>
              ) : (
                "✅ Update Budget"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditBudget;
