"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import db from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import React, { useState } from "react";
import { Budgets } from "@/utils/schema";
import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";
import moment from "moment";

const AddExpense = ({ budgetId, refreshData, expType }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const AddNewExpense = async () => {
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: Number(amount),
        budgetId: budgetId,
        createdAt: moment().format("DD/MM/YYYY"),
      })
      .returning({ insertedId: Budgets.id });
    console.log(result);
    if (result) {
      refreshData();
      toast("New Expense Added!");
      setName("");
      setAmount("");
    }
  };
  return (
    <div className="flex flex-col gap-3 border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div>
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder={`Enter ${toTitleCase(expType)} Expense`}
          onChange={(e) => setName(toTitleCase(e.target.value))}
          value={name}
        />
      </div>
      <div>
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. $ 80"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
      </div>
      <Button
        onClick={() => AddNewExpense()}
        className="cursor-pointer"
        disabled={!(name && amount)}
      >
        Add New Expense
      </Button>
    </div>
  );
};

export default AddExpense;
