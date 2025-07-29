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

const CreateBudget = ({ refreshData }) => {
  const [emoji, setEmoji] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const { user } = useUser();

  // New Budget

  const onCreateBudget = async () => {
    const result = await db
      .insert(Budgets)
      .values({
        name: budgetName,
        amount: Number(budgetAmount),
        createdBy: user.primaryEmailAddress.emailAddress, // now safe
        icon: emoji,
        createdAt: moment().format("DD/MM/YYYY"),
      })
      .returning({ insertedId: Budgets.id });

    if (result) {
      refreshData();
      toast("New Budget Created!");
      setBudgetName("");
      setBudgetAmount("");
      setEmoji("😀");
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
        <DialogContent className="absolute top-1/2">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
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
                    onChange={(e) => setBudgetName(toTitleCase(e.target.value))}
                    value={budgetName}
                  />
                </div>

                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    type="number"
                    placeholder="e.g. 500"
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    value={budgetAmount}
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
                onClick={() => onCreateBudget()}
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
