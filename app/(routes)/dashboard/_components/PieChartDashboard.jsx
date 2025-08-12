"use client";
import React, { useState, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const RADIAN = Math.PI / 180;

// Label renderer for pie slices
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}) => {
  if (percent < 0.02) return null;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="select-none"
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

// Budgets Pie component
const BudgetsPie = React.memo(({ data, onClick }) => (
  <div className="min-w-[400px] md:w-[600px] h-[300px] flex flex-col justify-center items-center gap-5">
    <h3 className="text-center font-semibold mb-2 border-b">Budgets</h3>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={70}
          dataKey="value"
          onClick={onClick}
          labelLine={false}
          label={renderCustomizedLabel}
          className="text-[8px] md:text-xs"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || `hsl(${(index * 137.5) % 360}, 70%, 60%)`}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
));

const PieChartDashboard = ({ budgetList = [] }) => {
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);

  // Prepare budget data with color
  const budgetData = useMemo(() => {
    return budgetList.map((b) => ({
      id: b.id,
      name: b.name,
      value: Number(b.amount),
      color: b.color ?? null, // use defined color or fallback
    }));
  }, [budgetList]);

  const handlePieClick = useCallback((data) => {
    const clickedId = data.payload.id;
    setSelectedBudgetId((prevId) => (prevId === clickedId ? null : clickedId));
  }, []);

  return (
    <>
      {budgetData.length > 0 ? (
        <div className="flex flex-col items-center w-full p-4 border rounded-lg gap-8">
          <BudgetsPie data={budgetData} onClick={handlePieClick} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M12 2v10l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="text-lg font-semibold mb-1">
            No Budget Data Available
          </h2>
          <p className="text-sm text-center max-w-xs">
            There is no budget data to display the pie chart. Please add budgets
            to see your expense breakdown.
          </p>
        </div>
      )}
    </>
  );
};

export default PieChartDashboard;
