"use client";
import React, { useState, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const RADIAN = Math.PI / 180;

const generateColors = (length) =>
  Array.from({ length }, (_, i) => `hsl(${(i * 137.5) % 360}, 70%, 60%)`);

// --- Label Renderers ---
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

const renderExpenseLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  payload,
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
      <tspan x={x} dy="-0.6em">
        {payload.budgetName}
      </tspan>
      <tspan x={x} dy="1.2em">
        ({payload.name}: {(percent * 100).toFixed(0)}%)
      </tspan>
    </text>
  );
};

// --- Pie Components ---
const BudgetsPie = React.memo(({ data, colors, onClick }) => (
  <div className="min-w-[400px] md:w-[600px] h-[300px] flex flex-col justify-center items-center gap-5">
    <h3 className="text-center font-semibold mb-2 border-b">Budgets</h3>
    <p className="text-center text-xs">Click each slice to see the spending</p>
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
          className="cursor-pointer text-[8px] md:text-sm"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
));

const SpendPie = React.memo(({ data, colors }) => (
  <div className="min-w-[400px] md:w-[600px] h-[300px] flex flex-col justify-center items-center">
    <h3 className="text-center font-semibold border-b">Total Spend So Far</h3>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          dataKey="value"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
));

const ExpensePie = React.memo(({ data, colors, budgetName }) => (
  <div className="min-w-[400px] md:w-[600px] h-[300px] flex flex-col justify-center items-center">
    <h3 className="text-center font-semibold border-b">
      Expenses under: {budgetName}
    </h3>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={70}
          dataKey="value"
          labelLine={false}
          label={renderExpenseLabel}
          className="text-[9px] md:text-sm"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
));

// --- Main Dashboard ---
const PieChartDashboard = ({ budgetList = [], expensesList = [] }) => {
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);

  const budgetData = useMemo(() => {
    return budgetList.map((b) => ({
      id: b.id,
      name: b.name,
      value: Number(b.amount),
    }));
  }, [budgetList]);

  const spendData = useMemo(() => {
    if (budgetList.length > 0) {
      return budgetList.map((b) => {
        const totalSpent = expensesList
          .filter((e) => e.budgetId === b.id)
          .reduce((sum, e) => sum + Number(e.amount), 0);
        return { name: b.name, value: totalSpent };
      });
    }

    // If no budgets, group expenses by category instead
    const categoryMap = new Map();
    for (const e of expensesList) {
      const cat = e.category || "Uncategorized";
      const amount = Number(e.amount);
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + amount);
    }

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [budgetList, expensesList]);

  const expenseData = useMemo(() => {
    if (!selectedBudgetId) return [];

    const budget = budgetList.find((b) => b.id === selectedBudgetId);
    if (!budget) return [];

    // Expenses under this budget
    const expenses = expensesList.filter(
      (e) => e.budgetId === selectedBudgetId
    );

    const totalExpenses = expenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

    // Prepare expense slices
    const expenseSlices = expenses.map((e) => ({
      name: e.name,
      value: Number(e.amount),
      budgetName: budget.name,
    }));

    // Add remaining budget slice if any
    const remaining = Number(budget.amount) - totalExpenses;
    if (remaining > 0) {
      expenseSlices.push({
        name: "Remaining Budget",
        value: remaining,
        budgetName: budget.name,
      });
    }

    return expenseSlices;
  }, [selectedBudgetId, expensesList, budgetList]);

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

  const handlePieClick = useCallback((data) => {
    const clickedId = data.payload.id;
    setSelectedBudgetId((prevId) => (prevId === clickedId ? null : clickedId));
  }, []);

  return (
    <div className="flex flex-col items-center w-full p-4 border rounded-lg gap-15">
      {budgetData.length > 0 && expensesList.length > 0 && (
        <div className="flex flex-col xl:flex-row justify-center items-center gap-15">
          <BudgetsPie
            data={budgetData}
            colors={budgetColors}
            onClick={handlePieClick}
          />
          {selectedBudgetId ? (
            expenseData.length > 0 ? (
              <ExpensePie
                data={expenseData}
                colors={expenseColors}
                budgetName={
                  budgetList.find((b) => b.id === selectedBudgetId)?.name ||
                  "Selected Budget"
                }
              />
            ) : (
              <div className="w-full max-w-[450px] h-[350px] mt-4 border-t pt-4 text-center font-semibold text-destructive">
                No expense found under{" "}
                {budgetList.find((b) => b.id === selectedBudgetId)?.name ||
                  "Selected Budget"}
              </div>
            )
          ) : null}
        </div>
      )}

      {/* Show SpendPie only if there are expenses but no budget data */}
      {budgetList.length === 0 && expensesList.length > 0 && (
        <SpendPie data={spendData} colors={spendColors} />
      )}

      {/* Optional: fallback for no data at all */}
      {expensesList.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          No expense data available to display charts.
        </div>
      )}
    </div>
  );
};

export default PieChartDashboard;
