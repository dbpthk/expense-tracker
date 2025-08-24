"use client";

import React, { useState } from "react";
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
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import moment from "moment";
import { toTitleCase } from "@/lib/utils";
import AIInput from "@/components/ui/ai-input";
import { useSubscription } from "@/context/SubscriptionContext";
import { useBudget } from "@/context/BugetContext";

// 🎨 12 Color Options
const COLOR_OPTIONS = [
  { name: "blue", hex: "#3B82F6" },
  { name: "red", hex: "#EF4444" },
  { name: "green", hex: "#10B981" },
  { name: "yellow", hex: "#FACC15" },
  { name: "purple", hex: "#8B5CF6" },
  { name: "orange", hex: "#F97316" },
  { name: "teal", hex: "#14B8A6" },
  { name: "pink", hex: "#EC4899" },
  { name: "indigo", hex: "#6366F1" },
  { name: "gray", hex: "#6B7280" },
  { name: "lime", hex: "#84CC16" },
  { name: "cyan", hex: "#06B6D4" },
  { name: "lavender", hex: "#8884d8" },
  { name: "lightGreen", hex: "#82ca9d" },
  { name: "gold", hex: "#ffc658" },
];

// Time Period Options
const TIME_PERIODS = [
  {
    value: "weekly",
    label: "Weekly",
    icon: "📅",
    description: "Resets every week",
  },
  {
    value: "monthly",
    label: "Monthly",
    icon: "📊",
    description: "Resets every month",
  },
];

const CreateBudget = ({ refreshData, prefillData }) => {
  const [emoji, setEmoji] = useState(prefillData?.icon || "😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [budgetName, setBudgetName] = useState(prefillData?.name || "");
  const [budgetAmount, setBudgetAmount] = useState(
    prefillData?.amount?.toString() || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    prefillData?.color || COLOR_OPTIONS[0].hex
  );
  const [timePeriod, setTimePeriod] = useState(
    prefillData?.timePeriod || "monthly"
  );
  const { user } = useUser();
  const [createdDate, setCreatedDate] = useState(
    prefillData?.date || moment().format("YYYY-MM-DD")
  );
  const { canCreateBudget, getRemainingBudgets, subscription } =
    useSubscription();
  const { budgetList } = useBudget();

  const handleAIDataParsed = (data) => {
    if (data.type === "budget") {
      setBudgetName(data.name || "");
      setBudgetAmount(data.amount?.toString() || "");
      if (data.date) {
        setCreatedDate(moment(data.date).format("YYYY-MM-DD"));
      }
    }
  };

  const onCreateBudget = async () => {
    const formattedDate = moment(createdDate).format("DD/MM/YYYY");

    // Check budget limit
    if (!canCreateBudget(budgetList?.length || 0)) {
      const remaining = getRemainingBudgets(budgetList.length);
      if (subscription.status === "trial") {
        // Offer to extend trial for unlimited budgets
        if (
          confirm(
            "You've reached your trial limit of 5 budgets. Would you like to extend your trial to create unlimited budgets for 1 month? (No credit card required)"
          )
        ) {
          // Extend trial
          const extendedTrial = {
            ...subscription,
            budgetLimit: 999, // Unlimited
            canCreateUnlimited: true,
          };
          localStorage.setItem(
            `subscription_${user.id}`,
            JSON.stringify(extendedTrial)
          );
          toast.success(
            "Trial extended! You can now create unlimited budgets for 1 month."
          );
        } else {
          toast.error(
            "You've reached your trial limit. Upgrade to Pro for unlimited budgets!"
          );
        }
        return;
      } else {
        toast.error(
          `You've reached your limit of ${subscription.budgetLimit} budgets. Upgrade to Pro for unlimited budgets!`
        );
        return;
      }
    }

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: budgetName,
          amount: parseFloat(budgetAmount),
          icon: emoji,
          color: selectedColor,
          createdAt: formattedDate,
          timePeriod: timePeriod,
        }),
      });

      if (response.ok) {
        refreshData();
        toast.success("Budget created successfully!");
        setBudgetName("");
        setBudgetAmount("");
        setEmoji("😀");
        setSelectedColor(COLOR_OPTIONS[0].hex);
        setTimePeriod("monthly");
        setCreatedDate(moment().format("YYYY-MM-DD"));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create budget");
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error("Failed to create budget. Please try again.");
    }
  };

  return (
    <div className="pt-0">
      <Dialog>
        <DialogTrigger asChild>
          <div className="group relative w-full h-48 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-blue-400">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-8 h-8 bg-blue-400 rounded-full"></div>
              <div className="absolute top-12 right-6 w-6 h-6 bg-purple-400 rounded-full"></div>
              <div className="absolute bottom-8 left-8 w-4 h-4 bg-indigo-400 rounded-full"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                +
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                Create New Budget
              </h3>
              <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                Start tracking your spending
              </p>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Create New Budget
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-6">
                {/* Budget Limit Indicator */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-800">
                        {subscription.status === "trial"
                          ? "Free Trial"
                          : "Free Plan"}
                      </span>
                    </div>
                    <span className="text-sm text-blue-600">
                      {getRemainingBudgets(budgetList.length)} of{" "}
                      {subscription.budgetLimit} budgets remaining
                    </span>
                  </div>
                  {subscription.status === "trial" &&
                    subscription.trialEndsAt && (
                      <p className="text-xs text-blue-600 mt-1">
                        Trial ends{" "}
                        {new Date(
                          subscription.trialEndsAt
                        ).toLocaleDateString()}
                      </p>
                    )}
                </div>

                <div className="mt-6 space-y-6">
                  {/* AI Input Section */}
                  <AIInput onDataParsed={handleAIDataParsed} type="budget" />
                  {/* Emoji Picker */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="cursor-pointer text-2xl"
                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  >
                    {emoji}
                  </Button>

                  {openEmojiPicker && (
                    <div className="absolute z-20 left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2">
                      <div className="relative">
                        <button
                          onClick={() => setOpenEmojiPicker(false)}
                          className="absolute top-2 right-2 z-10 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          ×
                        </button>
                        <div style={{ transform: "scale(0.8)" }}>
                          <EmojiPicker
                            onEmojiClick={(emojiData) => {
                              setEmoji(emojiData.emoji);
                              setOpenEmojiPicker(false);
                            }}
                            searchPlaceholder="Search emojis..."
                            width={300}
                            height={400}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Budget Name */}
                  <div className="mt-4">
                    <h3 className="text-black font-medium my-1">Budget Name</h3>
                    <Input
                      placeholder="e.g. Grocery"
                      onChange={(e) =>
                        setBudgetName(toTitleCase(e.target.value || ""))
                      }
                      value={budgetName}
                    />
                  </div>

                  {/* Budget Amount */}
                  <div className="mt-4">
                    <h3 className="text-black font-medium my-1">
                      Budget Amount
                    </h3>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="999999.99"
                      placeholder="e.g. 500.50"
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow empty value and valid numbers
                        if (value === "" || !isNaN(parseFloat(value))) {
                          setBudgetAmount(value);
                        }
                      }}
                      value={budgetAmount}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter amount with up to 2 decimal places (e.g., 500.25)
                    </p>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-black font-medium my-1">Select Date</h3>
                    <Input
                      type="date"
                      value={createdDate}
                      onChange={(e) => setCreatedDate(e.target.value)}
                    />
                  </div>

                  {/* Time Period Selection */}
                  <div className="mt-4">
                    <h3 className="text-black font-medium my-1">
                      Budget Period
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {TIME_PERIODS.map((period) => (
                        <button
                          key={period.value}
                          type="button"
                          onClick={() => setTimePeriod(period.value)}
                          className={`p-4 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-md ${
                            timePeriod === period.value
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{period.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {period.label}
                              </div>
                              <div className="text-sm text-gray-500">
                                {period.description}
                              </div>
                            </div>
                            {timePeriod === period.value && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Picker */}
                  <div className="mt-4">
                    <h3 className="text-black font-medium my-1">
                      Select a Color
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color.hex}
                          type="button"
                          onClick={() => setSelectedColor(color.hex)}
                          className={`w-8 h-8 rounded-full border-2 transition ${
                            selectedColor === color.hex
                              ? "ring-2 ring-offset-2 ring-gray-600"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color.hex }}
                          aria-label={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <div className="flex flex-col gap-2 w-full">
              <DialogClose asChild>
                <Button
                  disabled={!(budgetName && budgetAmount)}
                  className="w-full cursor-pointer"
                  onClick={onCreateBudget}
                >
                  Create Budget
                </Button>
              </DialogClose>
              {prefillData && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setBudgetName(prefillData.name || "");
                    setBudgetAmount(prefillData.amount?.toString() || "");
                    setEmoji(prefillData.icon || "💰");
                    setSelectedColor(prefillData.color || COLOR_OPTIONS[0].hex);
                    setTimePeriod(prefillData.timePeriod || "monthly");
                    setCreatedDate(
                      prefillData.date || moment().format("YYYY-MM-DD")
                    );
                    toast.success("AI data applied to form!");
                  }}
                  className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  Use AI Data
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBudget;
