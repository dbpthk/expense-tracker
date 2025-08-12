"use client";

import React, { useMemo, useState } from "react";
import { useBudget } from "@/context/BugetContext";
import moment from "moment";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const Expense = () => {
  const { expensesList, budgetList, getBudgetList } = useBudget();
  const [monthOffset, setMonthOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const currentMonth = moment().add(monthOffset, "months").format("MMMM YYYY");

  const filteredExpenses = useMemo(() => {
    return expensesList.filter((expense) => {
      return (
        moment(expense.createdAt, "DD/MM/YYYY").format("MMMM YYYY") ===
          currentMonth &&
        expense.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [expensesList, currentMonth, searchTerm]);

  const totalCurrentMonth = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  const totalTillDate = useMemo(() => {
    return expensesList.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expensesList]);

  const groupedByDate = useMemo(() => {
    const grouped = {};
    filteredExpenses.forEach((expense) => {
      const date = expense.createdAt;
      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][expense.category])
        grouped[date][expense.category] = [];
      grouped[date][expense.category].push(expense);
    });
    return grouped;
  }, [filteredExpenses]);

  const chartData = useMemo(() => {
    const dayTotals = {};
    filteredExpenses.forEach((expense) => {
      const day = expense.createdAt;
      if (!dayTotals[day]) dayTotals[day] = 0;
      dayTotals[day] += expense.amount;
    });
    return Object.entries(dayTotals).map(([day, total]) => ({
      date: day,
      amount: total,
    }));
  }, [filteredExpenses]);

  // Updated pieData with "Other Expenses" for categories < 5%
  const pieData = useMemo(() => {
    const totals = {};
    filteredExpenses.forEach((expense) => {
      if (!totals[expense.category]) totals[expense.category] = 0;
      totals[expense.category] += expense.amount;
    });

    const totalAmount = Object.values(totals).reduce((a, b) => a + b, 0);

    const mainCategories = [];
    let otherTotal = 0;

    Object.entries(totals).forEach(([category, amount]) => {
      const percent = amount / totalAmount;
      if (percent < 0.05) {
        otherTotal += amount;
      } else {
        mainCategories.push({ name: category, value: amount });
      }
    });

    if (otherTotal > 0) {
      mainCategories.push({ name: "Other Expenses", value: otherTotal });
    }

    return mainCategories;
  }, [filteredExpenses]);

  const getCategoryColor = (category) => {
    if (category === "Other Expenses") return "#999999"; // Gray for Others
    const match = budgetList.find((b) => b.name === category);
    return match?.color || "#8884d8";
  };

  const getCategoryIcon = (category) => {
    const match = budgetList.find((b) => b.name === category);
    return match?.icon || "💼";
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto p-4 sm:p-6">
      <div>
        <h2 className="text-3xl font-extrabold mb-4 text-gray-900 text-center">
          Expenses Overview – {currentMonth}
        </h2>
        <div className="flex justify-between bg-[#3B82F6] p-3 items-center mb-2">
          <div className="text-sm tracking-tight font-medium text-white text-left">
            Monthly Expenditure ({currentMonth}):{" "}
            <span className="text-white">${totalCurrentMonth.toFixed(2)}</span>
          </div>
          <div className="text-sm tracking-tight font-medium text-white text-right">
            All-Time Spending:{" "}
            <span className="text-white">${totalTillDate.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMonthOffset((prev) => prev - 1)}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={18} /> Prev
          </Button>
          <Button
            variant="outline"
            onClick={() => setMonthOffset((prev) => prev + 1)}
            className="flex items-center gap-1"
          >
            Next <ChevronRight size={18} />
          </Button>
        </div>
        <Input
          type="text"
          placeholder="Search expense name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border rounded-lg shadow-sm bg-white">
          <p className="text-lg">
            No expenses found for the selected month or search term.
          </p>
        </div>
      ) : (
        <>
          <div className="w-full h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#4b5563" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#4b5563" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value}`, "Total"]}
                  contentStyle={{ fontSize: "0.875rem" }}
                />
                <Bar
                  dataKey="amount"
                  fill="#60a5fa"
                  radius={[6, 6, 0, 0]}
                  barSize={22}
                  activeBar={{
                    fill: "#3b82f6",
                    barSize: 26,
                    radius: [8, 8, 0, 0],
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Note about Other Expenses */}
          <div className="text-sm text-center text-gray-600 mb-2 italic">
            Categories below 5% are grouped as <strong>Other Expenses</strong>.
          </div>

          <div className="w-full h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  className="text-[9px] sm:text-[11px]"
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getCategoryColor(entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, "Category"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-5">
            {Object.entries(groupedByDate).map(([date, categories]) => {
              const totalForDay = Object.values(categories)
                .flat()
                .reduce((sum, e) => sum + e.amount, 0);
              return (
                <div
                  key={date}
                  className="border border-gray-200 rounded-lg shadow-sm bg-white"
                >
                  <div className="bg-gray-100 w-full px-4 py-2 flex justify-between items-center">
                    <h2 className="font-semibold text-lg text-gray-800">
                      {date}
                    </h2>
                    <span className="text-sm font-medium text-gray-600">
                      Total: ${totalForDay.toFixed(2)}
                    </span>
                  </div>

                  {Object.entries(categories).map(([category, expenses]) => {
                    const budgetId = expenses[0]?.budgetId;
                    const totalForCategory = expenses.reduce(
                      (sum, e) => sum + e.amount,
                      0
                    );
                    const categoryColor = getCategoryColor(category);

                    return (
                      <Link
                        key={category}
                        href={
                          budgetId ? `/dashboard/expenses/${budgetId}` : "#"
                        }
                        className="block cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-none px-6 py-3"
                        style={{ color: categoryColor }}
                      >
                        <h3
                          className="flex items-center gap-3 font-semibold text-base mb-1"
                          style={{ color: categoryColor }}
                        >
                          <span className="text-xl">
                            {getCategoryIcon(category)}
                          </span>
                          <span>
                            {category} –{" "}
                            <span className="font-semibold">
                              ${totalForCategory.toFixed(2)}
                            </span>
                          </span>
                        </h3>
                        <ul className="pl-6 text-sm text-gray-700 space-y-1">
                          {expenses.map((expense) => (
                            <li
                              key={expense.id}
                              className="flex justify-between border-b border-gray-100 py-1 last:border-none"
                            >
                              {expense.name}
                              <span
                                className="font-medium"
                                style={{ color: categoryColor }}
                              >
                                ${expense.amount.toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Expense;
