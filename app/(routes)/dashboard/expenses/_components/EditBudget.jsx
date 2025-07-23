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
import db from "@/utils/dbConfig";
import { eq } from "drizzle-orm";
import { Budgets } from "@/utils/schema";
import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";

const EditBudget = ({ budgetInfo, refreshData }) => {
  const [emoji, setEmoji] = useState();
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [budgetName, setBudgetName] = useState();
  const [budgetAmount, setBudgetAmount] = useState();

  useEffect(() => {
    if (budgetInfo) {
      setEmoji(budgetInfo?.icon);
      setBudgetName(budgetInfo?.name);
      setBudgetAmount(budgetInfo?.amount);
    }
  }, [budgetInfo]);

  const onUpdateBudget = async () => {
    const result = await db
      .update(Budgets)
      .set({
        name: budgetName,
        amount: budgetAmount,
        icon: emoji,
      })
      .where(eq(Budgets.id, budgetInfo.id))
      .returning();
    if (result) {
      toast("Budget Updated");
      refreshData();
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="cursor-pointer">
            <PenBox /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="absolute top-1/2">
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer text-2xl"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emoji}
                </Button>

                <div className="absolute z-20 left-1/2 -translate-x-1/2 mt-2 ">
                  {openEmojiPicker && (
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setEmoji(emojiData.emoji);
                        setOpenEmojiPicker(false);
                      }}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g. Grocery"
                    value={budgetName}
                    onChange={(e) => setBudgetName(toTitleCase(e.target.value))}
                  />
                </div>

                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    type="number"
                    placeholder="e.g. 500"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(budgetName && budgetAmount)}
                className="mt-2 w-full cursor-pointer"
                onClick={() => onUpdateBudget()}
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditBudget;
