"use client";
import React, { useEffect } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader.jsx";
import db from "@/utils/dbConfig";
import { useUser } from "@clerk/nextjs";
import { Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    user && checkUserBudgets();
  }, [user]);

  const checkUserBudgets = async () => {
    const result = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress));
    console.log(result);
    if (result?.length === 0) {
      router.replace("/dashboard/budgets");
    }
  };

  return (
    <div>
      <div className="fixed hidden md:block md:w-64 border shadow-sm">
        <SideNav />
      </div>

      <div className="md:ml-64 ">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
