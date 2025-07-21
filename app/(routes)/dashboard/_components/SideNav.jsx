"use client";
import React from "react";
import Image from "next/image";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SideNav = () => {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 3,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    },
    {
      id: 4,
      name: "Upgrade",
      icon: ShieldCheck,
      path: "/dashboard/upgrade",
    },
  ];

  const path = usePathname();

  return (
    <div className="h-screen p-5">
      <Image src={"./logo.svg"} width={200} height={100} alt="logo" />

      <div className="mt-5 flex flex-col gap-3">
        {menuList.map((menu) => (
          <Link href={menu.path} key={menu.id}>
            <h2
              className={cn(
                "flex items-center gap-2 text-gray-700 font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-green-100",
                path === menu.path && "text-primary bg-green-100"
              )}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-10 p-5 flex gap-4 item-center font-medium text-gray-700">
        <UserButton />
        Profile
      </div>
    </div>
  );
};

export default SideNav;
