"use client";
import { sql, eq, and, getTableColumns, desc } from "drizzle-orm";
import db from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import { use } from "react";
import ExpenseListTable from "../_components/ExpenseListTable";

const ExpenseItem = ({ params }) => {
  const { id } = use(params);
  const { user, isLoaded } = useUser();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expensesList, setExpensesList] = useState();

  useEffect(() => {
    if (user && isLoaded) {
      getBudgetInfo();
    }
  }, [user, isLoaded]);

  // Get Budget information

  const getBudgetInfo = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`SUM(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
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

  // Get latest expenses

  const getExpensesList = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, id))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  return (
    <div className=" p-10 flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold">My Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
          {budgetInfo ? (
            <BudgetItem
              id={budgetInfo.id}
              name={budgetInfo.name}
              icon={budgetInfo.icon}
              totalItem={budgetInfo.totalItem}
              amount={budgetInfo.amount}
              totalSpend={budgetInfo.totalSpend}
            />
          ) : (
            <div className="w-full h-[160px] bg-[#9aecb729] rounded-lg animate-pulse"></div>
          )}
          {budgetInfo ? (
            <AddExpense
              budgetId={id}
              expType={budgetInfo.name}
              user={user}
              refreshData={() => getBudgetInfo()}
            />
          ) : (
            <div className="w-full h-[160px] bg-[#9aecb729] rounded-lg animate-pulse"></div>
          )}
        </div>
      </div>
      <div>
        <h2 className="font-bold text-xl">Latest Expenses</h2>
        <ExpenseListTable
          expensesList={expensesList}
          refereshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
};

export default ExpenseItem;
