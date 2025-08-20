"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  Target,
  PiggyBank,
  Zap,
  Bell,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced notification types for real financial events
const NOTIFICATION_TYPES = {
  BUDGET_EXCEEDED: "budget_exceeded",
  SPENDING_TIGHT: "spending_tight",
  EXPENSE_ADDED: "expense_added",
  BUDGET_CREATED: "budget_created",
  BUDGET_UPDATED: "budget_updated",
  EXPENSE_DELETED: "expense_deleted",
  WARNING: "warning",
  INFO: "info",
};

// Notification sound and push notification handler
const handleNotificationAlert = (notification) => {
  try {
    const settings = localStorage.getItem("notificationSettings_user");
    if (settings) {
      const { soundEnabled, pushNotifications } = JSON.parse(settings);

      if (soundEnabled) {
        // Play notification sound
        const audio = new Audio();
        audio.src =
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaCEWOzO/RgDEELIzU8ctRZQIIGmzC7Z4mFQ19pOntuJOUQAJHBBBhm9ffcNl3x...";
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }

      if (
        pushNotifications &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.png",
          tag: notification.id,
        });
      }
    }
  } catch (error) {
    console.log("Notification settings not found");
  }
};

// Enhanced notification logic with smart financial insights
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [lastSpendingCheck, setLastSpendingCheck] = useState(Date.now());

  // Real-time notification system for actual financial events
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: `${notification.type}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
      priority: notification.priority || 3,
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 20)); // Keep last 20 notifications
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Enhanced notification logic for real financial events only
  const checkSmartBudgetInsights = (budgetList, expensesList) => {
    if (!budgetList || !Array.isArray(budgetList)) return;

    budgetList.forEach((budget) => {
      if (!budget || !budget.amount || budget.amount === 0) return;

      const spendingPercentage =
        (Number(budget.totalSpend || 0) / Number(budget.amount)) * 100;
      const remaining = Number(budget.amount) - Number(budget.totalSpend || 0);

      // Only create notifications for critical financial events
      // 🔴 Budget Exceeded Alert - High Priority
      if (spendingPercentage > 100) {
        addNotification({
          type: NOTIFICATION_TYPES.BUDGET_EXCEEDED,
          title: "Budget Exceeded",
          message: `Your ${budget.name} budget has been exceeded by $${(
            Number(budget.totalSpend) - Number(budget.amount)
          ).toFixed(2)}.`,
          budgetId: budget.id,
          priority: 1,
          category: "budget",
        });
      }
      // 🟡 Spending Tight Alert - Medium Priority (only at 95%+)
      else if (spendingPercentage >= 95) {
        addNotification({
          type: NOTIFICATION_TYPES.SPENDING_TIGHT,
          title: "Budget Warning",
          message: `You've used ${spendingPercentage.toFixed(1)}% of your ${
            budget.name
          } budget. Only $${remaining.toFixed(2)} remaining.`,
          budgetId: budget.id,
          priority: 2,
          category: "budget",
        });
      }
    });
  };

  // Function to add expense notifications
  const addExpenseNotification = (expense, budget) => {
    addNotification({
      type: NOTIFICATION_TYPES.EXPENSE_ADDED,
      title: "Expense Added",
      message: `$${expense.amount} added to ${budget?.name || "your budget"}`,
      budgetId: expense.budgetId,
      priority: 3,
      category: "expense",
    });
  };

  // Function to add budget notifications
  const addBudgetNotification = (budget) => {
    addNotification({
      type: NOTIFICATION_TYPES.BUDGET_CREATED,
      title: "Budget Created",
      message: `New budget "${budget.name}" created with $${budget.amount}`,
      budgetId: budget.id,
      priority: 3,
      category: "budget",
    });
  };

  // Trigger sound and push notifications when new notifications are added
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      handleNotificationAlert(latestNotification);
    }
  }, [notifications]);

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const triggerNotificationCheck = (budgetList, expensesList) => {
    checkSmartBudgetInsights(budgetList, expensesList);
  };

  // Get unread notification count
  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  const value = {
    notifications,
    getNotificationCount: () => notifications.length,
    getUnreadCount,
    dismissNotification,
    markAsRead: (id) => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    },
    markAllAsRead: () => {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    },
    triggerNotificationCheck,
    addExpenseNotification,
    addBudgetNotification,
    clearAllNotifications: () => {
      setNotifications([]);
    },
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
