"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user } = useUser();
  const [subscription, setSubscription] = useState({
    status: "free", // free, trial, pro, enterprise
    trialEndsAt: null,
    budgetLimit: 5,
    expenseLimit: 50,
    canCreateUnlimited: false,
    canExport: false,
    canUploadReceipts: false,
    hasCustomCategories: false, // Removed - categories feature disabled
    hasAdvancedAnalytics: false,
    hasSmartReminders: false,
    monthlyExpenseCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const storedSubscription = localStorage.getItem(
        `subscription_${user.id}`
      );

      if (storedSubscription) {
        const parsed = JSON.parse(storedSubscription);
        setSubscription(parsed);
      } else {
        // Set default free trial for new users
        const trialEndsAt = new Date();
        trialEndsAt.setMonth(trialEndsAt.getMonth() + 1);

        const defaultSubscription = {
          status: "trial",
          trialEndsAt: trialEndsAt.toISOString(),
          budgetLimit: 5,
          expenseLimit: 50,
          canCreateUnlimited: false,
          canExport: false,
          canUploadReceipts: false,
          hasCustomCategories: false, // Removed - categories feature disabled
          hasAdvancedAnalytics: false,
          hasSmartReminders: false,
          monthlyExpenseCount: 0,
        };

        setSubscription(defaultSubscription);
        localStorage.setItem(
          `subscription_${user.id}`,
          JSON.stringify(defaultSubscription)
        );
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
    } finally {
      setLoading(false);
    }
  };

  const upgradeToPro = async () => {
    try {
      // Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_pro_aud_monthly", // AUD 2.99/month price ID
          userId: user.id,
          currency: "aud",
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        // For demo purposes, simulate upgrade
        const proSubscription = {
          ...subscription,
          status: "pro",
          budgetLimit: 999,
          expenseLimit: 99999,
          canCreateUnlimited: true,
          canExport: true,
          canUploadReceipts: true,
          hasCustomCategories: true, // Removed - categories feature disabled
          hasAdvancedAnalytics: true,
          hasSmartReminders: true,
        };
        setSubscription(proSubscription);
        localStorage.setItem(
          `subscription_${user.id}`,
          JSON.stringify(proSubscription)
        );
      }
    } catch (error) {
      console.error("Error upgrading to pro:", error);
      throw error;
    }
  };

  const downgradeToFree = async () => {
    try {
      // If user has Stripe subscription, cancel it
      if (subscription.stripeSubscriptionId) {
        const response = await fetch("/api/stripe/cancel-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscriptionId: subscription.stripeSubscriptionId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to cancel Stripe subscription");
        }
      }

      // Update local subscription to free
      const freeSubscription = {
        ...subscription,
        status: "free",
        budgetLimit: 5,
        expenseLimit: 50,
        canCreateUnlimited: false,
        canExport: false,
        canUploadReceipts: false,
        hasCustomCategories: false,
        hasAdvancedAnalytics: false,
        hasSmartReminders: false,
        stripeSubscriptionId: null,
        monthlyExpenseCount: 0,
      };

      setSubscription(freeSubscription);
      localStorage.setItem(
        `subscription_${user.id}`,
        JSON.stringify(freeSubscription)
      );

      toast.success("Successfully downgraded to Free plan");
    } catch (error) {
      console.error("Error downgrading to free:", error);
      toast.error("Failed to downgrade. Please try again.");
      throw error;
    }
  };

  const openBillingPortal = async () => {
    try {
      if (!subscription.stripeCustomerId) {
        toast.error("No billing information found");
        return;
      }

      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: subscription.stripeCustomerId,
          returnUrl: `${window.location.origin}/dashboard/upgrade`,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error("Failed to create billing portal session");
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
      toast.error("Failed to open billing portal. Please try again.");
    }
  };

  const canCreateBudget = (currentBudgetCount) => {
    if (
      subscription.status === "pro" ||
      subscription.status === "enterprise" ||
      subscription.canCreateUnlimited
    ) {
      return true;
    }

    if (subscription.status === "trial") {
      const now = new Date();
      const trialEnd = new Date(subscription.trialEndsAt);
      if (now < trialEnd) {
        return currentBudgetCount < subscription.budgetLimit;
      }
    }

    return currentBudgetCount < subscription.budgetLimit;
  };

  const canAddExpense = (currentExpenseCount) => {
    if (subscription.status === "pro" || subscription.status === "enterprise") {
      return true;
    }

    // Check monthly limit for free and trial users
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyCount = subscription.monthlyExpenseCount || 0;

    if (subscription.status === "trial") {
      const trialEnd = new Date(subscription.trialEndsAt);
      if (now < trialEnd) {
        return monthlyCount < subscription.expenseLimit;
      }
    }

    return monthlyCount < subscription.expenseLimit;
  };

  const incrementExpenseCount = () => {
    const updatedSubscription = {
      ...subscription,
      monthlyExpenseCount: (subscription.monthlyExpenseCount || 0) + 1,
    };
    setSubscription(updatedSubscription);
    if (user) {
      localStorage.setItem(
        `subscription_${user.id}`,
        JSON.stringify(updatedSubscription)
      );
    }
  };

  const resetMonthlyExpenseCount = () => {
    const updatedSubscription = {
      ...subscription,
      monthlyExpenseCount: 0,
    };
    setSubscription(updatedSubscription);
    if (user) {
      localStorage.setItem(
        `subscription_${user.id}`,
        JSON.stringify(updatedSubscription)
      );
    }
  };

  const getRemainingBudgets = (currentBudgetCount) => {
    if (
      subscription.status === "pro" ||
      subscription.status === "enterprise" ||
      subscription.canCreateUnlimited
    ) {
      return "Unlimited";
    }
    const remaining = subscription.budgetLimit - currentBudgetCount;
    return Math.max(0, remaining);
  };

  const getRemainingExpenses = () => {
    if (subscription.status === "pro" || subscription.status === "enterprise") {
      return "Unlimited";
    }
    const remaining =
      subscription.expenseLimit - (subscription.monthlyExpenseCount || 0);
    return Math.max(0, remaining);
  };

  const getSubscriptionStatus = () => {
    if (subscription.status === "trial") {
      const now = new Date();
      const trialEnd = new Date(subscription.trialEndsAt);
      if (now >= trialEnd) {
        return "expired";
      }
      return "trial";
    }
    return subscription.status;
  };

  const setCurrency = (newCurrency) => {
    const updatedSubscription = { ...subscription, currency: newCurrency };
    setSubscription(updatedSubscription);
    if (user) {
      localStorage.setItem(
        `subscription_${user.id}`,
        JSON.stringify(updatedSubscription)
      );
    }
  };

  const getFeatureAccess = () => {
    return {
      canExport:
        subscription.canExport ||
        subscription.status === "pro" ||
        subscription.status === "enterprise",
      canUploadReceipts:
        subscription.canUploadReceipts ||
        subscription.status === "pro" ||
        subscription.status === "enterprise",
      hasCustomCategories: false, // Removed - categories feature disabled
      hasAdvancedAnalytics:
        subscription.hasAdvancedAnalytics ||
        subscription.status === "pro" ||
        subscription.status === "enterprise",
      hasSmartReminders:
        subscription.hasSmartReminders ||
        subscription.status === "pro" ||
        subscription.status === "enterprise",
    };
  };

  const value = {
    subscription,
    loading,
    upgradeToPro,
    downgradeToFree,
    openBillingPortal,
    canCreateBudget,
    canAddExpense,
    incrementExpenseCount,
    resetMonthlyExpenseCount,
    getRemainingBudgets,
    getRemainingExpenses,
    getSubscriptionStatus,
    checkSubscriptionStatus,
    setCurrency,
    getFeatureAccess,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
