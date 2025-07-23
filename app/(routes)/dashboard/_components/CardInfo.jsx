import { PiggyBank, ReceiptText, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";

const CardInfo = ({ budgetList }) => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    budgetList && CalculateCardInfo();
  }, [budgetList]);
  const CalculateCardInfo = () => {
    console.log(budgetList);
    let totalBudget_ = 0;
    let totalSpend_ = 0;

    budgetList.forEach((element) => {
      totalBudget_ = totalBudget_ + Number(element.amount);
      totalSpend_ = totalSpend_ + Number(element.totalSpend);
    });
    console.log(totalSpend_, "budget", totalBudget_);
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  };
  return (
    <>
      {budgetList ? (
        <div className="mt-8 grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className=" p-7 border rounded-lg flex items-center justify-between">
            <div>
              <h2 className="text-sm">Total Budget</h2>
              <h2 className="text-2xl font-bold">${totalBudget}</h2>
            </div>
            <PiggyBank className="bg-primary text-white h-12 w-13 p-2 rounded-full" />
          </div>
          <div className=" p-7 border rounded-lg flex items-center justify-between">
            <div>
              <h2 className="text-sm">Total Spent</h2>
              <h2 className="text-2xl font-bold">${totalSpend}</h2>
            </div>
            <ReceiptText className="bg-primary text-white h-12 w-13 p-2 rounded-full" />
          </div>
          <div className=" p-7 border rounded-lg flex items-center justify-between">
            <div>
              <h2 className="text-sm">Number of Budgets</h2>
              <h2 className="text-2xl font-bold">{budgetList?.length}</h2>
            </div>
            <Wallet className="bg-primary text-white h-12 w-13 p-2 rounded-full" />
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
