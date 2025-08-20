"use client";
import React from "react";
import DashboardHeader from "./_components/DashboardHeader";
import { Toaster } from "@/components/ui/sonner";

const DashboardClientWrapper = ({ children }) => {
  return (
    <>
      <DashboardHeader />
      <Toaster />
      {children}
    </>
  );
};

export default DashboardClientWrapper;
