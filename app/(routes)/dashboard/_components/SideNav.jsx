"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const menuList = [
  { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { id: 2, name: "Budgets", icon: PiggyBank, path: "/dashboard/budgets" },
  { id: 3, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses" },
  { id: 4, name: "Upgrade", icon: ShieldCheck, path: "/dashboard/upgrade" },
];

const SideNav = () => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMobileMenu = () => setIsOpen((prev) => !prev);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const renderMenu = () => (
    <nav className="flex flex-col gap-3 mt-5">
      {menuList.map((menu) => (
        <Link href={menu.path} key={menu.id} onClick={() => setIsOpen(false)}>
          <span
            className={cn(
              "flex items-center gap-2 text-gray-700 font-medium p-4 rounded-md hover:text-primary hover:bg-green-100 transition",
              path === menu.path && "text-primary bg-green-100"
            )}
          >
            <menu.icon className="w-5 h-5" />
            {menu.name}
          </span>
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-64 bg-white shadow-md p-5">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="logo"
            width={180}
            height={80}
            className="object-contain"
          />
        </Link>
        {renderMenu()}
        <div className="mt-auto p-4 flex items-center gap-3 text-gray-700">
          <UserButton />
          <span>Profile</span>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 shadow-md bg-white fixed top-0 left-0 w-full z-50">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="logo"
            width={140}
            height={60}
            className="object-contain"
          />
        </Link>
        <Button onClick={toggleMobileMenu} variant="ghost" size="icon">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 p-6 overflow-y-auto">
          {renderMenu()}
          <div className="mt-8 border-t pt-4 flex items-center gap-3 text-gray-700">
            <UserButton />
            <span>Profile</span>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from hiding behind mobile header */}
      <div className="md:hidden h-[64px]" />
    </>
  );
};

export default SideNav;
