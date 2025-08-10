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
import { Budgets } from "@/utils/schema";
import { toast } from "sonner";
import db from "@/utils/dbConfig";
import moment from "moment";
import { toTitleCase } from "@/lib/utils";

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

const CreateBudget = ({ refreshData }) => {
  const [emoji, setEmoji] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].hex);
  const { user } = useUser();

  const onCreateBudget = async () => {
    const result = await db
      .insert(Budgets)
      .values({
        name: budgetName,
        amount: Number(budgetAmount),
        createdBy: user.primaryEmailAddress.emailAddress,
        icon: emoji,
        color: selectedColor,
        createdAt: moment().format("DD/MM/YYYY"),
      })
      .returning({ insertedId: Budgets.id });

    if (result) {
      refreshData();
      toast("New Budget Created!");
      setBudgetName("");
      setBudgetAmount("");
      setEmoji("😀");
      setSelectedColor(COLOR_OPTIONS[0].hex);
      setOpenEmojiPicker(false);
    }
  };

  return (
    <div className="pt-0">
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-col border-2 bg-[#9aecb729] p-12 rounded-md items-center cursor-pointer hover:shadow-md">
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent className="fixed top-1/2">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
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
                  <div className="absolute z-20 left-1/2 -translate-x-1/2 mt-2">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setEmoji(emojiData.emoji);
                        setOpenEmojiPicker(false);
                      }}
                    />
                  </div>
                )}

                {/* Budget Name */}
                <div className="mt-4">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
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
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    type="number"
                    placeholder="e.g. 500"
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    value={budgetAmount}
                  />
                </div>

                {/* Color Picker */}
                <div className="mt-4">
                  <h2 className="text-black font-medium my-1">
                    Select a Color
                  </h2>
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
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(budgetName && budgetAmount)}
                className="mt-2 w-full cursor-pointer"
                onClick={onCreateBudget}
              >
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBudget;
