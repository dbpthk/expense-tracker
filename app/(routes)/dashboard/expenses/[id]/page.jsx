"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditBudget from "../../budgets/_components/EditBudget";

const ExpenseItem = ({ params }) => {
  const route = useRouter();
  const { id } = params;
  const { user, isLoaded } = useUser();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isLoaded) {
      getBudgetInfo();
    }
  }, [user, isLoaded]);

  const getBudgetInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/budgets/${id}?email=${user?.primaryEmailAddress?.emailAddress}`
      );
      if (response.ok) {
        const result = await response.json();
        setBudgetInfo(result);
        getExpensesList();
      } else {
        toast.error("Failed to fetch budget info");
      }
    } catch (error) {
      console.error("Error fetching budget info:", error);
      toast.error("Error fetching budget info");
    } finally {
      setLoading(false);
    }
  };

  const getExpensesList = async () => {
    try {
      const response = await fetch(
        `/api/expenses?email=${user?.primaryEmailAddress?.emailAddress}`
      );
      if (response.ok) {
        const result = await response.json();
        // Filter expenses for this specific budget
        const budgetExpenses = result.filter(
          (expense) => expense.budgetId === parseInt(id)
        );
        setExpensesList(budgetExpenses);
      } else {
        toast.error("Failed to fetch expenses");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Error fetching expenses");
    }
  };

  const deleteBudget = async () => {
    try {
      // Delete expenses first
      const expensesResponse = await fetch(
        `/api/expenses?email=${user?.primaryEmailAddress?.emailAddress}`
      );
      if (expensesResponse.ok) {
        const expenses = await expensesResponse.json();
        const budgetExpenses = expenses.filter(
          (expense) => expense.budgetId === parseInt(id)
        );

        // Delete each expense
        for (const expense of budgetExpenses) {
          await fetch(`/api/expenses/${expense.id}`, {
            method: "DELETE",
          });
        }
      }

      // Delete budget
      const budgetResponse = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });

      if (budgetResponse.ok) {
        toast.success("Budget Deleted");
        route.replace("/dashboard/budgets");
      } else {
        toast.error("Failed to delete budget");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Error deleting budget");
    }
  };

  return (
    <div className="p-10 flex flex-col gap-8">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <ArrowLeft
              className="cursor-pointer h-7 w-7"
              onClick={() => route.replace("/dashboard/expense")}
            />
            <h2 className="text-2xl font-bold">My Expenses</h2>
          </div>
          <div className="flex flex-row gap-5 justify-between items-center">
            <EditBudget budgetInfo={budgetInfo} refreshData={getBudgetInfo} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="flex gap-2 cursor-pointer"
                  variant="destructive"
                >
                  <Trash /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your current budget along with expenses and remove your data
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteBudget}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 mt-6 gap-5">
          {budgetInfo ? (
            <BudgetItem
              id={budgetInfo.id}
              name={budgetInfo.name}
              icon={budgetInfo.icon}
              totalItem={budgetInfo.totalItem}
              amount={budgetInfo.amount}
              totalSpend={budgetInfo.totalSpend}
              color={budgetInfo.color} // pass color here
            />
          ) : (
            <div className="w-full h-[160px] bg-[#9aecb729] rounded-lg animate-pulse"></div>
          )}

          {budgetInfo ? (
            <AddExpense
              budgetId={id}
              expType={budgetInfo.name}
              budgetAmount={budgetInfo.amount}
              currentTotalExpenses={
                Array.isArray(expensesList)
                  ? expensesList.reduce((acc, e) => acc + e.amount, 0)
                  : 0
              }
              refreshData={getBudgetInfo}
              refreshExpenses={getExpensesList}
            />
          ) : (
            <div className="w-full h-[160px] bg-[#9aecb729] rounded-lg animate-pulse"></div>
          )}
        </div>
      </div>

      <div>
        <ExpenseListTable
          expensesList={expensesList}
          refreshData={getBudgetInfo}
        />
      </div>
    </div>
  );
};

export default ExpenseItem;
