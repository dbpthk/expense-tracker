// "use client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import db from "@/utils/dbConfig";
// import { Expenses, Budgets } from "@/utils/schema";
// import React, { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { toTitleCase } from "@/lib/utils";
// import moment from "moment";
// import { Loader } from "lucide-react";
// import { useBudget } from "@/context/BugetContext";
// import { eq } from "drizzle-orm";

// const AddExpense = ({ budgetId, refreshData, refereshExpenses, expType }) => {
//   const [name, setName] = useState("");
//   const [amount, setAmount] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [color, setColor] = useState("");
//   const { setReferesh } = useBudget();
//   const [expenseDate, setExpenseDate] = useState(moment().format("YYYY-MM-DD")); // default to today

//   // Fetch budget color by budgetId
//   useEffect(() => {
//     if (!budgetId) return;

//     const fetchBudgetColor = async () => {
//       try {
//         const budget = await db
//           .select({ color: Budgets.color })
//           .from(Budgets)
//           .where(eq(Budgets.id, budgetId))
//           .limit(1);

//         if (budget.length > 0) {
//           setColor(budget[0].color);
//         } else {
//           setColor("");
//         }
//       } catch (error) {
//         console.error("Failed to fetch budget color:", error);
//         setColor("");
//       }
//     };

//     fetchBudgetColor();
//   }, [budgetId]);

//   const AddNewExpense = async () => {
//     setLoading(true);
//     try {
//       const formattedDate = moment(expenseDate).format("DD/MM/YYYY");
//       const result = await db
//         .insert(Expenses)
//         .values({
//           name,
//           amount: Number(amount),
//           budgetId,
//           createdAt: formattedDate,
//           category: expType,
//           // If you want to save color per expense, uncomment this line and add `color` column in schema:
//           color,
//         })
//         .returning({ insertedId: Expenses.id });

//       if (result) {
//         toast("New Expense Added!");
//         refreshData();
//         refereshExpenses();
//         setReferesh((prev) => prev + 1);
//         setName("");
//         setAmount("");
//         setExpenseDate(moment().format("YYYY-MM-DD"));
//       }
//     } catch (error) {
//       console.error("Error adding expense:", error);
//       toast.error("Failed to add expense.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col gap-3 border p-5 rounded-lg">
//       <h2 className="font-bold text-lg">Add Expense</h2>
//       <div>
//         <h2 className="text-black font-medium my-1">Expense Name</h2>
//         <Input
//           placeholder={`Enter ${toTitleCase(expType)} Expense`}
//           onChange={(e) => setName(toTitleCase(e.target.value))}
//           value={name}
//         />
//       </div>
//       <div>
//         <h2 className="text-black font-medium my-1">Expense Amount</h2>
//         <Input
//           type="number"
//           placeholder="e.g. $ 80"
//           onChange={(e) => setAmount(e.target.value)}
//           value={amount}
//         />
//       </div>

//       {/* Expense Date */}
//       <div>
//         <h2 className="text-black font-medium my-1">Expense Date</h2>
//         <Input
//           type="date"
//           value={expenseDate}
//           onChange={(e) => setExpenseDate(e.target.value)}
//         />
//       </div>

//       {/* Optional UI to show budget color */}
//       {color && (
//         <div className="flex items-center gap-2 mt-2">
//           <div
//             className="w-6 h-6 rounded-full border"
//             style={{ backgroundColor: color }}
//             aria-label="Budget color indicator"
//           />
//           <span className="text-sm text-gray-600">Budget color applied</span>
//         </div>
//       )}

//       <Button
//         onClick={AddNewExpense}
//         className="cursor-pointer mt-4"
//         disabled={!(name && amount) || loading}
//       >
//         {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
//       </Button>
//     </div>
//   );
// };

// export default AddExpense;
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import db from "@/utils/dbConfig";
import { Expenses, Budgets } from "@/utils/schema";
import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";
import moment from "moment";
import { Loader } from "lucide-react";
import { useBudget } from "@/context/BugetContext";
import { eq } from "drizzle-orm";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const AddExpense = ({
  budgetId,
  refreshData,
  refereshExpenses,
  expType,
  budgetAmount,
  currentTotalExpenses = 0,
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("");
  const { setReferesh } = useBudget();
  const [expenseDate, setExpenseDate] = useState(moment().format("YYYY-MM-DD")); // default to today

  // For showing warning dialog
  const [openWarning, setOpenWarning] = useState(false);

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

  const addExpenseToDB = async () => {
    setLoading(true);
    try {
      const formattedDate = moment(expenseDate).format("DD/MM/YYYY");
      const result = await db
        .insert(Expenses)
        .values({
          name,
          amount: Number(amount),
          budgetId,
          createdAt: formattedDate,
          category: expType,
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
        setExpenseDate(moment().format("YYYY-MM-DD"));
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense.");
    }
    setLoading(false);
  };

  const handleAddClick = () => {
    if (!name || !amount) {
      toast.error("Please enter expense name and amount.");
      return;
    }

    const newTotal = Number(currentTotalExpenses) + Number(amount);

    if (
      budgetAmount !== undefined &&
      budgetAmount !== null &&
      newTotal > Number(budgetAmount)
    ) {
      setOpenWarning(true);
    } else {
      addExpenseToDB();
    }
  };

  const onConfirmWarning = () => {
    setOpenWarning(false);
    addExpenseToDB();
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

      {/* Expense Date */}
      <div>
        <h2 className="text-black font-medium my-1">Expense Date</h2>
        <Input
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
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
        onClick={handleAddClick}
        className="cursor-pointer mt-4"
        disabled={!(name && amount) || loading}
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>

      {/* Warning Dialog */}
      <AlertDialog open={openWarning} onOpenChange={setOpenWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning: Budget Exceeded</AlertDialogTitle>
            <AlertDialogDescription>
              Adding this expense will exceed your budget limit of{" "}
              <strong>${budgetAmount}</strong>. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmWarning}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddExpense;
