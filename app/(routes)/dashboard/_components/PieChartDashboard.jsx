"use client";
import React, { useState, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const RADIAN = Math.PI / 180;

// Color generator
const generateColors = (length) =>
  Array.from({ length }, (_, i) => `hsl(${(i * 137.5) % 360}, 70%, 60%)`);

// Budget and Spend label
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}) => {
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

// Expense under selected budget label
const renderExpenseLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  payload,
}) => {
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
      {`${payload.budgetName} (${payload.name}: ${(percent * 100).toFixed(
        0
      )}%)`}
    </text>
  );
};

// Separate memoized Pie components to avoid unnecessary re-renders
const BudgetsPie = React.memo(({ data, colors, onClick }) => (
  <div className="w-[450px] h-[300px]">
    <h3 className="text-center font-semibold mb-2">Budgets</h3>
    <p className="text-center text-xs">Click each slice to see the spending</p>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          dataKey="value"
          onClick={onClick}
          labelLine
          label={renderCustomizedLabel}
          className="cursor-pointer text-xs md:text-sm"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
));

const SpendPie = React.memo(({ data, colors }) => (
  <div className="w-[450px] h-[300px]">
    <h3 className="text-center font-semibold mb-2">Total Spend So Far</h3>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          dataKey="value"
          labelLine
          label={renderCustomizedLabel}
          className="text-xs md:text-sm"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
));

const ExpensePie = React.memo(({ data, colors, budgetName }) => (
  <div className="w-[450px] h-[350px] mt-4 border-t pt-4">
    <h3 className="text-center font-semibold mb-2">
      Expenses under: {budgetName}
    </h3>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          labelLine
          label={renderExpenseLabel}
          className="text-xs md:text-sm"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
));

const PieChartDashboard = ({ budgetList, expensesList }) => {
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);

  // Memoize budgetData to keep reference stable
  const budgetData = useMemo(() => {
    return budgetList.map((b) => ({
      id: b.id,
      name: b.name,
      value: Number(b.amount),
    }));
  }, [budgetList]);

  // Memoize spendData to keep reference stable
  const spendData = useMemo(() => {
    return budgetList.map((b) => {
      const totalSpent = expensesList
        .filter((e) => e.budgetId === b.id)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      return { name: b.name, value: totalSpent };
    });
  }, [budgetList, expensesList]);

  // Memoize expenseData for selected budget
  const expenseData = useMemo(() => {
    if (!selectedBudgetId) return [];
    return expensesList
      .filter((e) => e.budgetId === selectedBudgetId)
      .map((e) => {
        const budgetName =
          budgetList.find((b) => b.id === e.budgetId)?.name || "Unknown";
        return {
          name: e.name,
          value: Number(e.amount),
          budgetName,
        };
      });
  }, [selectedBudgetId, expensesList, budgetList]);

  // Memoize color arrays
  const budgetColors = useMemo(
    () => generateColors(budgetData.length),
    [budgetData]
  );
  const spendColors = useMemo(
    () => generateColors(spendData.length),
    [spendData]
  );
  const expenseColors = useMemo(
    () => generateColors(expenseData.length),
    [expenseData]
  );

  // Memoized click handler, toggles selection
  const handlePieClick = useCallback((data) => {
    const clickedId = data.payload.id;
    setSelectedBudgetId((prevId) => (prevId === clickedId ? null : clickedId));
  }, []);

  return (
    <div className="flex flex-col gap-15 items-center w-full p-4 border rounded-lg select-none">
      <div className="flex flex-col xl:flex-row justify-center items-center gap-10">
        <BudgetsPie
          data={budgetData}
          colors={budgetColors}
          onClick={handlePieClick}
          className="border"
        />
        {/* Pie 3: Expenses under selected budget */}
        {selectedBudgetId &&
          (expenseData.length > 0 ? (
            <ExpensePie
              data={expenseData}
              colors={expenseColors}
              budgetName={
                budgetList.find((b) => b.id === selectedBudgetId)?.name ||
                "Selected Budget"
              }
            />
          ) : (
            <div className="w-full max-w-[400px] h-[350px] mt-4 border pt-4 text-center font-semibold">
              No expense found under{" "}
              {budgetList.find((b) => b.id === selectedBudgetId)?.name ||
                "Selected Budget"}
            </div>
          ))}
      </div>

      <SpendPie data={spendData} colors={spendColors} />
    </div>
  );
};

export default PieChartDashboard;
