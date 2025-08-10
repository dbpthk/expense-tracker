"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import db from "@/utils/dbConfig";
import { Expenses, Budgets } from "@/utils/schema";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";
import moment from "moment";
import { Loader } from "lucide-react";
import { useBudget } from "@/context/BugetContext";
import { eq } from "drizzle-orm";

const AddExpense = ({ budgetId, refreshData, refereshExpenses, expType }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("");
  const { setReferesh } = useBudget();

  // Fetch budget color by budgetId
  useEffect(() => {
    if (!budgetId) return;

    const fetchBudgetColor = async () => {
      try {
        const budget = await db
          .select({ color: Budgets.color })
          .from(Budgets)
          .where(eq(Budgets.id, budgetId))
          .limit(1);

        if (budget.length > 0) {
          setColor(budget[0].color);
        } else {
          setColor("");
        }
      } catch (error) {
        console.error("Failed to fetch budget color:", error);
        setColor("");
      }
    };

    fetchBudgetColor();
  }, [budgetId]);

  const AddNewExpense = async () => {
    setLoading(true);
    try {
      const result = await db
        .insert(Expenses)
        .values({
          name,
          amount: Number(amount),
          budgetId,
          createdAt: moment().format("DD/MM/YYYY"),
          category: expType,
          // If you want to save color per expense, uncomment this line and add `color` column in schema:
          color,
        })
        .returning({ insertedId: Expenses.id });

      if (result) {
        toast("New Expense Added!");
        refreshData();
        refereshExpenses();
        setReferesh((prev) => prev + 1);
        setName("");
        setAmount("");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense.");
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
          type="number"
          placeholder="e.g. $ 80"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
      </div>

      {/* Optional UI to show budget color */}
      {color && (
        <div className="flex items-center gap-2 mt-2">
          <div
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: color }}
            aria-label="Budget color indicator"
          />
          <span className="text-sm text-gray-600">Budget color applied</span>
        </div>
      )}

      <Button
        onClick={AddNewExpense}
        className="cursor-pointer mt-4"
        disabled={!(name && amount) || loading}
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
};

export default AddExpense;
