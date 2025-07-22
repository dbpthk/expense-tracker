import React from "react";

const Progressbar = ({ amount, totalSpend }) => {
  const progress =
    amount && totalSpend
      ? Math.min((Number(totalSpend) / Number(amount)) * 100, 100)
      : 0;
  return (
    <div className="w-full bg-green-100 h-2 rounded">
      <div
        className="bg-primary h-2 rounded"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default Progressbar;
