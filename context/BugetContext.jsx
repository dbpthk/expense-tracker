"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(0);

  //refresh data
  const [refresh, setReferesh] = useState(0);

  // Memoized user email to prevent unnecessary re-renders
  const userEmail = useMemo(
    () => user?.primaryEmailAddress?.emailAddress,
    [user?.primaryEmailAddress?.emailAddress]
  );

  // Debounced refresh function to prevent rapid API calls
  const debouncedRefresh = useCallback(() => {
    setReferesh((prev) => prev + 1);
  }, []);

  // Optimized data fetching with better caching
  const getBudgetList = useCallback(
    async (forceRefresh = false) => {
      if (!userEmail) return;

      // Check if we should fetch (avoid unnecessary calls)
      const now = Date.now();
      if (!forceRefresh && now - lastFetch < 10000) {
        // Increased cache time to 10 seconds for better performance
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/budgets`);
        if (response.ok) {
          const result = await response.json();
          setBudgetList(result);
          setLastFetch(now);

          // Calculate totals based on fetched budgets
          calculateCardInfo(result);

          // Only fetch expenses if budgets changed or forced
          if (forceRefresh || result.length !== budgetList.length) {
            getAllExpenses(result);
          }
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userEmail, lastFetch, budgetList.length]
  );

  const getAllExpenses = useCallback(
    async (currentBudgets = null) => {
      if (!userEmail) return;

      try {
        const response = await fetch(`/api/expenses?email=${userEmail}`);
        if (response.ok) {
          const result = await response.json();
          setExpensesList(result);

          // Trigger notifications after expenses are loaded
          // Use passed budgets or current budgetList
          const budgetsToCheck = currentBudgets || budgetList;

          // Reduced timeout for better responsiveness
          setTimeout(() => {
            triggerNotificationCheck(budgetsToCheck, result);
          }, 100); // Reduced from 200ms to 100ms
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    },
    [userEmail, budgetList, triggerNotificationCheck]
  );

  const calculateCardInfo = useCallback((budgets) => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;

    budgets.forEach((element) => {
      totalBudget_ += parseFloat(element.amount || 0);
      totalSpend_ += parseFloat(element.totalSpend || 0);
    });

    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  }, []);

  // Memoized refresh function to prevent unnecessary re-renders
  const refreshData = useCallback(() => {
    debouncedRefresh();
  }, [debouncedRefresh]);

  // Optimized effect to fetch data only when necessary
  useEffect(() => {
    if (user && isLoaded && userEmail) {
      getBudgetList(true); // Force refresh on initial load only
    }
  }, [user, isLoaded, userEmail]); // Removed refresh dependency to prevent infinite loops

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      budgetList,
      expensesList,
      getBudgetList,
      getAllExpenses,
      user,
      isLoaded,
      totalBudget,
      totalSpend,
      setReferesh: refreshData,
      isLoading,
      refreshData,
    }),
    [
      budgetList,
      expensesList,
      getBudgetList,
      getAllExpenses,
      user,
      isLoaded,
      totalBudget,
      totalSpend,
      refreshData,
      isLoading,
    ]
  );

  return (
    <BudgetContext.Provider value={contextValue}>
      {children}
    </BudgetContext.Provider>
  );
};
