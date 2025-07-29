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
import { motion, AnimatePresence } from "framer-motion";

const menuList = [
  { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { id: 2, name: "Budgets", icon: PiggyBank, path: "/dashboard/budgets" },
  { id: 3, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses" },
  { id: 4, name: "Upgrade", icon: ShieldCheck, path: "/dashboard/upgrade" },
];

const NavBar = () => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const renderMenu = () => (
    <nav className="flex flex-col gap-3 mt-5">
      {menuList.map((menu) => (
        <Link
          href={menu.path}
          key={menu.id}
          onClick={() => setIsOpen((prev) => !prev)}
        >
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
      <aside className="hidden md:flex flex-col h-screen w-64 bg-white shadow-md gap-5 p-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="logo"
            width={180}
            height={80}
            className="object-contain"
          />
        </Link>
        <div>{renderMenu()}</div>
        <div className="mt-auto p-4 flex items-center gap-3 text-gray-700">
          <UserButton />
          <span>Profile</span>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-5 shadow-md bg-white fixed w-full z-50 top-0 left-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="logo"
            width={180}
            height={80}
            className="object-contain"
          />
        </Link>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle Menu"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="x-icon"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-10 h-10 cursor-pointer" />
              </motion.div>
            ) : (
              <motion.div
                key="menu-icon"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-8 h-8 text-gray-800 cursor-pointer" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Drawer with Slide-in Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="md:hidden fixed inset-0 bg-white z-40 p-6 pt-20 mt-15 overflow-y-auto"
          >
            {renderMenu()}
            <div className="mt-8 border-t pt-4 flex items-center gap-3 text-gray-700">
              <UserButton />
              <span>Profile</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="md:hidden h-[80px]" />
    </>
  );
};

export default NavBar;
