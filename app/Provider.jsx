"use client";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { BudgetProvider } from "@/context/BugetContext";
import { NotificationProvider } from "@/context/NotificationContext";

const Provider = ({ children }) => {
  return (
    <ClerkProvider>
      <SubscriptionProvider>
        <NotificationProvider>
          <BudgetProvider>{children}</BudgetProvider>
        </NotificationProvider>
      </SubscriptionProvider>
    </ClerkProvider>
  );
};

export default Provider;
