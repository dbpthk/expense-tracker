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
import { Loader } from "lucide-react";

const AddExpense = ({ budgetId, refreshData, refereshExpenses, expType }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // use to add new expense
  const AddNewExpense = async () => {
    setLoading(true);
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: Number(amount),
        budgetId: budgetId,
        createdAt: moment().format("DD/MM/YYYY"),
        category: expType,
      })

      .returning({ insertedId: Budgets.id });
    if (result) {
      setLoading(false);
      refreshData();
      refereshExpenses();
      toast("New Expense Added!");
      setName("");
      setAmount("");
    }
    setLoading(false);
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
        disabled={!(name && amount) || loading}
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
};

export default AddExpense;
