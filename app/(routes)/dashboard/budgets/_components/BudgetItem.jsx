"use client";
import Link from "next/link";
import React from "react";
import { toTitleCase } from "@/lib/utils";

const BudgetItem = ({ id, icon, name, totalItem, amount, totalSpend }) => {
  const remaining = Number(amount ?? 0) - Number(totalSpend ?? 0);

  const progress =
    amount && totalSpend
      ? Math.min((Number(totalSpend) / Number(amount)) * 100, 100)
      : 0;

  return (
    <Link
      href={`/dashboard/expenses/${id}`}
      className="p-5 border rounded-lg hover:shadow-md cursor-pointer h-[160px]"
    >
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl p-3 px-4 bg-[#9aecb729] rounded-full">
            {icon}
          </h2>
          <div>
            <h2 className="font-bold">{toTitleCase(name)}</h2>
            <h2 className="text-sm text-gray-500">
              {totalItem} Item{totalItem !== 1 && "s"}
            </h2>
          </div>
        </div>
        <h2 className="font-medium text-primary text-lg">${amount}</h2>
      </div>

      <div className="mt-5">
        <div className="flex flex-row item-center justify-between mb-2">
          <h2 className="text-xs md:text-sm text-slate-400">
            ${totalSpend ?? 0} Spent
          </h2>
          <h2 className="text-xs md:text-sm text-slate-400">
            ${remaining} Remaining
          </h2>
        </div>

        <div className="w-full bg-green-100 h-2 rounded">
          <div
            className="bg-primary h-2 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </Link>
  );
};

export default BudgetItem;
