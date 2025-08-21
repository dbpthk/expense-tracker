import { useBudget } from "@/context/BugetContext";
import { PiggyBank, ReceiptText, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";

const CardInfo = ({ budgetList }) => {
  const { totalBudget, totalSpend } = useBudget();

  return (
    <>
      {budgetList ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-4 sm:p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-green-50 to-green-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-sm font-medium text-gray-600">
                  Total Budget
                </h2>
                <h2 className="text-2xl sm:text-3xl font-bold text-green-700">
                  ${totalBudget?.toLocaleString() || "0"}
                </h2>
                <p className="text-xs text-green-600">Available to spend</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-500 rounded-full shadow-lg">
                <PiggyBank className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-red-50 to-red-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-sm font-medium text-gray-600">
                  Total Spent
                </h2>
                <h2 className="text-2xl sm:text-3xl font-bold text-red-700">
                  ${totalSpend?.toLocaleString() || "0"}
                </h2>
                <p className="text-xs text-red-600">Money spent</p>
              </div>
              <div className="p-2 sm:p-3 bg-red-500 rounded-full shadow-lg">
                <ReceiptText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-sm font-medium text-gray-600">
                  Active Budgets
                </h2>
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">
                  {budgetList?.length || "0"}
                </h2>
                <p className="text-xs text-blue-600">Budgets tracked</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-500 rounded-full shadow-lg">
                <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        //if budgetlist not available
        <div className="mt-8 grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-[110px] bg-[#9aecb729] rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      )}
    </>
  );
};

export default CardInfo;
