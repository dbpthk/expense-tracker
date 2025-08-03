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

const Expense = () => {
  const { expensesList, budgetList } = useBudget();
  const [monthOffset, setMonthOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const currentMonth = moment().add(monthOffset, "months").format("MMMM YYYY");

  // Filter expenses by selected month
  const filteredExpenses = useMemo(() => {
    return expensesList.filter((expense) => {
      return (
        moment(expense.createdAt, "DD/MM/YYYY").format("MMMM YYYY") ===
          currentMonth &&
        expense.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [expensesList, currentMonth, searchTerm]);

  // Group expenses by date and category
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

  const pieData = useMemo(() => {
    const totals = {};
    filteredExpenses.forEach((expense) => {
      if (!totals[expense.category]) totals[expense.category] = 0;
      totals[expense.category] += expense.amount;
    });
    return Object.entries(totals).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  }, [filteredExpenses]);

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
    "#FFBB28",
  ];

  const getCategoryIcon = (category) => {
    const match = budgetList.find((b) => b.name === category);
    return match?.icon || "💼";
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto p-4 sm:p-6">
      <h2 className="text-3xl font-extrabold mb-4 text-gray-900">
        Expenses Overview – {currentMonth}
      </h2>

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

      {/* Bar chart */}
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
            <Tooltip formatter={(value) => [`$${value}`, "Total"]} />
            <Bar
              dataKey="amount"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
              barSize={18}
              activeBar={{ fill: "#2563eb", barSize: 22, radius: [8, 8, 0, 0] }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart */}
      <div className="w-full h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${value}`, "Category"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown by date and category - no toggling, always visible */}
      <div className="flex flex-col gap-5">
        {Object.entries(groupedByDate).map(([date, categories]) => (
          <div
            key={date}
            className="border border-gray-200 rounded-lg shadow-sm bg-white p-4"
          >
            <h2 className="font-semibold text-lg mb-4 text-gray-800">{date}</h2>
            {Object.entries(categories).map(([category, expenses]) => (
              <div key={category} className="mb-6">
                <h3 className="text-primary font-semibold text-base border-b pb-1 flex items-center gap-3 text-gray-800">
                  <span className="text-xl">{getCategoryIcon(category)}</span>
                  <span>
                    {category} –{" "}
                    <span className="text-red-700 font-semibold">
                      $
                      {expenses
                        .reduce((sum, e) => sum + e.amount, 0)
                        .toFixed(2)}
                    </span>
                  </span>
                </h3>

                <ul className="pl-4 text-sm text-gray-700 space-y-1 mt-2">
                  {expenses.map((expense) => (
                    <li
                      key={expense.id}
                      className="flex justify-between border-b border-gray-100 py-1"
                    >
                      <span>{expense.name}</span>
                      <span className="font-medium text-red-700">
                        ${expense.amount.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expense;
