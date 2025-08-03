"use client";
import Link from "next/link";
import React from "react";
import { toTitleCase } from "@/lib/utils";
import Progressbar from "@/components/ui/Progressbar";

const BudgetItem = ({
  id,
  icon,
  name,
  totalItem,
  amount,
  totalSpend,
  color, // fallback blue color
}) => {
  const remaining = Number(amount ?? 0) - Number(totalSpend ?? 0);

  return (
    <Link href={`/dashboard/expenses/${id}`}>
      <div
        className="p-5 border rounded-lg hover:shadow-md cursor-pointer h-[160px] border-l-8"
        style={{ borderColor: color }}
      >
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <h2
              className="text-2xl p-3 px-4 bg-[#9aecb729] rounded-full flex items-center justify-center"
              style={{ color }}
            >
              {icon}
            </h2>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
                aria-label="Budget color indicator"
              />
              <h2 className="font-bold">{toTitleCase(name)}</h2>
            </div>
            <div />
          </div>
          <h2 className="font-medium text-primary text-lg" style={{ color }}>
            ${amount}
          </h2>
        </div>

        <div className="mt-5">
          <div className="flex flex-row items-center justify-between mb-2">
            <h2 className="text-xs md:text-sm text-chart-1">
              ${totalSpend ?? 0} Spent
            </h2>
            <h2 className="text-xs md:text-sm text-primary">
              ${remaining} Remaining
            </h2>
          </div>

          <Progressbar amount={amount} totalSpend={totalSpend} />
        </div>
      </div>
    </Link>
  );
};

export default BudgetItem;
