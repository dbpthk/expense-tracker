"use client";
import { sql, eq, and, getTableColumns, desc } from "drizzle-orm";
import db from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useEffect, useState, use } from "react";
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
import EditBudget from "../_components/EditBudget";

const ExpenseItem = ({ params }) => {
  const route = useRouter();
  const { id } = use(params);
  const { user, isLoaded } = useUser();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expensesList, setExpensesList] = useState();

  useEffect(() => {
    if (user && isLoaded) {
      getBudgetInfo();
    }
  }, [user, isLoaded]);

  const getBudgetInfo = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`SUM(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
          color: Budgets.color, // added color fetch
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(
          and(
            eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress),
            eq(Budgets.id, id)
          )
        )
        .groupBy(Budgets.id);

      setBudgetInfo(result[0]);
      getExpensesList();
    } catch (error) {
      console.error("Error fetching budget info:", error);
    }
  };

  const getExpensesList = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, id))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  const deleteBudget = async () => {
    const deleteExpenseResult = await db
      .delete(Expenses)
      .where(eq(Expenses.budgetId, id))
      .returning();
    if (deleteExpenseResult) {
      await db.delete(Budgets).where(eq(Budgets.id, id)).returning();
    }
    toast("Budget Deleted");
    route.replace("/dashboard/budgets");
  };

  return (
    <div className="p-10 flex flex-col gap-8">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <ArrowLeft
              className="cursor-pointer h-7 w-7"
              onClick={() => route.replace("/dashboard")}
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
              user={user}
              refreshData={getBudgetInfo}
              refereshExpenses={getExpensesList}
              color={budgetInfo.color} // pass color here too
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
