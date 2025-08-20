"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  PiggyBank,
  FolderCog,
  HandCoins,
  ReceiptText,
  ShieldCheck,
  Menu,
  X,
  TrendingUp,
  Settings,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useBudget } from "@/context/BugetContext";
import { useUser } from "@clerk/nextjs";

const menuList = [
  { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { id: 2, name: "Budgets", icon: HandCoins, path: "/dashboard/budgets" },
  {
    id: 3,
    name: "Manage Expenses",
    icon: FolderCog,
    path: "/dashboard/manage-expenses",
  },
  {
    id: 4,
    name: "View Expenses",
    icon: ReceiptText,
    path: "/dashboard/expense",
  },
  { id: 5, name: "Settings", icon: Settings, path: "/dashboard/settings" },
  { id: 6, name: "Upgrade", icon: ShieldCheck, path: "/dashboard/upgrade" },
  // Development only - remove in production
  ...(process.env.NODE_ENV === "development"
    ? [
        {
          id: 7,
          name: "Stripe Test",
          icon: ShieldCheck,
          path: "/dashboard/stripe-test",
        },
      ]
    : []),
];

const NavBar = () => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  // Lock scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const renderMenu = () => (
    <nav className="flex flex-col gap-2 mt-6">
      {menuList.map((menu) => (
        <Link href={menu.path} key={menu.id} onClick={() => setIsOpen(false)}>
          <span
            className={cn(
              "flex items-center gap-3 text-gray-700 font-medium p-3 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all duration-200",
              path === menu.path &&
                "text-blue-600 bg-blue-50 border border-blue-200"
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
      <aside className="hidden lg:flex flex-col h-screen w-72 bg-white shadow-lg border-r border-gray-100 gap-6 p-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            ExpenseTracker
          </span>
        </Link>

        {/* Navigation Menu */}
        <div className="flex-1">{renderMenu()}</div>

        {/* User Profile */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <UserButton
              appearance={{
                elements: {
                  rootBox: "w-12 h-12",
                  userButtonAvatarBox: "w-12 h-12",
                  avatarBox: "w-12 h-12",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              ExpenseTracker
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  rootBox: "w-10 h-10",
                  userButtonAvatarBox: "w-10 h-10",
                  avatarBox: "w-10 h-10",
                },
              }}
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden"
            >
              <div className="p-6 h-full flex flex-col">
                {/* Mobile Logo */}
                <div className="flex items-center justify-between mb-6">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      ExpenseTracker
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1">{renderMenu()}</div>

                {/* Mobile User Profile */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <UserButton
                      appearance={{
                        elements: {
                          rootBox: "w-12 h-12",
                          userButtonAvatarBox: "w-12 h-12",
                          avatarBox: "w-12 h-12",
                        },
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
