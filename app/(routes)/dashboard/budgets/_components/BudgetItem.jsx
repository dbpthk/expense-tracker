import React from "react";

const BudgetItem = (budget) => {
  // capitalise budget name
  const toTitleCase = (str) => {
    const lowerWords = [
      "and",
      "or",
      "the",
      "of",
      "in",
      "on",
      "a",
      "an",
      "for",
      "to",
      "with",
      "at",
      "by",
      "from",
    ];
    return str
      .toLowerCase()
      .split(" ")
      .map((word, i) =>
        i === 0 || !lowerWords.includes(word)
          ? word.charAt(0).toUpperCase() + word.slice(1)
          : word
      )
      .join(" ");
  };

  return (
    <div className="p-5 border rounded-lg hover:shadow-md cursor-pointer">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl p-3 px-4 bg-[#9aecb729] rounded-full">
            {budget?.icon}
          </h2>
          <div>
            <h2 className="font-bold">{toTitleCase(budget.name)}</h2>
            <h2 className="text-sm text-gray-500">{budget.totalItem} Item</h2>
          </div>
        </div>
        <h2 className="font-medium text-primary text-lg">${budget.amount}</h2>
      </div>
      <div className="mt-5">
        <div className="flex flex-row item-center justify-between mb-2">
          <h2 className="text-xs md:text-sm text-slate-400">
            ${budget.totalSpend ? budget.totalSpend : 0} Spent
          </h2>
          <h2 className="text-xs md:text-sm text-slate-400">
            ${Number(budget.amount) - Number(budget.totalSpend)} Remaining
          </h2>
        </div>

        <div className="w-full bg-green-100 h-2">
          <div className="w-[40%] bg-primary h-2"></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetItem;
