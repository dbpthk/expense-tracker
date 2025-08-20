"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useNotifications } from "./NotificationContext";

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { triggerNotificationCheck } = useNotifications();

  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);

  //refresh data
  const [refresh, setReferesh] = useState(0);

  useEffect(() => {
    if (user && isLoaded) {
      getBudgetList();
    }
  }, [user, isLoaded, refresh]);

  const getBudgetList = async () => {
    try {
      const response = await fetch(
        `/api/budgets?email=${user?.primaryEmailAddress?.emailAddress}`
      );
      if (response.ok) {
        const result = await response.json();
        setBudgetList(result);
        // Calculate totals based on fetched budgets
        calculateCardInfo(result);
        // Pass the current budgets to getAllExpenses to ensure notifications are triggered with fresh data
        getAllExpenses(result);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const getAllExpenses = async (currentBudgets = null) => {
    try {
      const response = await fetch(
        `/api/expenses?email=${user?.primaryEmailAddress?.emailAddress}`
      );
      if (response.ok) {
        const result = await response.json();
        setExpensesList(result);

        // Trigger notifications after expenses are loaded
        // Use passed budgets or current budgetList
        const budgetsToCheck = currentBudgets || budgetList;
        setTimeout(() => {
          triggerNotificationCheck(budgetsToCheck, result);
        }, 1000);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const calculateCardInfo = (budgets) => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;

    budgets.forEach((element) => {
      totalBudget_ += Number(element.amount);
      totalSpend_ += Number(element.totalSpend);
    });

    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  };

  return (
    <BudgetContext.Provider
      value={{
        budgetList,
        expensesList,
        getBudgetList,
        getAllExpenses,
        user,
        isLoaded,
        totalBudget,
        totalSpend,
        setReferesh,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
