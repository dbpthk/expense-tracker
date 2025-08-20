"use client";

import React, { useMemo, useState } from "react";
import { useBudget } from "@/context/BugetContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { useUser } from "@clerk/nextjs";
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
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";

const Expense = () => {
  const { expensesList, budgetList } = useBudget();
  const { subscription } = useSubscription();
  const { user } = useUser();
  const [monthOffset, setMonthOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [exporting, setExporting] = useState(false);

  // Simulate feature access check
  const featureAccess = {
    canExport:
      subscription?.status === "pro" || subscription?.canCreateUnlimited,
  };

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

  const handleExport = async (format) => {
    if (!featureAccess.canExport) {
      toast.error("Export feature is available for Pro users only", {
        description: "Upgrade to Pro to export your expense data.",
        action: {
          label: "Upgrade",
          onClick: () => (window.location.href = "/dashboard/upgrade"),
        },
      });
      return;
    }

    try {
      setExporting(true);

      if (format === "xlsx") {
        const worksheet = XLSX.utils.json_to_sheet(expensesList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
        XLSX.writeFile(
          workbook,
          `expenses-${new Date().toISOString().split("T")[0]}.xlsx`
        );
        toast.success("Expenses exported as Excel successfully!");
        return;
      }

      if (format === "csv" || format === "json") {
        const dataStr =
          format === "csv"
            ? XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(expensesList))
            : JSON.stringify(expensesList, null, 2);

        const blob = new Blob([dataStr], { type: "text/plain;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `expenses-${
          new Date().toISOString().split("T")[0]
        }.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success(`Expenses exported as ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export expenses", {
        description: "Please try again or contact support.",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header + Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Expenses Overview – {currentMonth}
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled={exporting || expensesList.length === 0}
            >
              <Download className="w-4 h-4" />
              {exporting ? "Exporting..." : "Export Data"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("csv")}>
              <FileSpreadsheet className="w-4 h-4" />
              Export as CSV
              {!featureAccess.canExport && (
                <span className="text-xs text-orange-600 ml-2">Pro</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("json")}>
              <FileText className="w-4 h-4" />
              Export as JSON
              {!featureAccess.canExport && (
                <span className="text-xs text-orange-600 ml-2">Pro</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("xlsx")}>
              <FileSpreadsheet className="w-4 h-4" />
              Export as Excel
              {!featureAccess.canExport && (
                <span className="text-xs text-orange-600 ml-2">Pro</span>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Monthly / All-Time totals */}
      <div className="flex justify-between bg-[#3B82F6] p-3 items-center mb-2 rounded-lg">
        <div className="text-sm tracking-tight font-medium text-white text-left">
          Monthly Expenditure ({currentMonth}):{" "}
          <span className="text-white font-bold">
            AUD ${totalCurrentMonth.toFixed(2)}
          </span>
        </div>
        <div className="text-sm tracking-tight font-medium text-white text-right">
          All-Time Spending:{" "}
          <span className="text-white font-bold">
            AUD ${totalTillDate.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Month navigation + search */}
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

      {/* No expenses */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border rounded-lg shadow-sm bg-white">
          <p className="text-lg">
            No expenses found for the selected month or search term.
          </p>
          {expensesList.length > 0 && (
            <p className="text-sm mt-2 text-gray-500">
              Try adjusting the month or search term to see your expenses.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Daily Bar Chart */}
          <div className="w-full h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Daily Spending
            </h3>
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
                  formatter={(value) => [`AUD $${value}`, "Total"]}
                  contentStyle={{ fontSize: "0.875rem" }}
                />
                <Bar
                  dataKey="amount"
                  fill="#60a5fa"
                  radius={[6, 6, 0, 0]}
                  barSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pie Chart */}
          <div className="text-sm text-center text-gray-600 mb-2 italic">
            Categories below 5% are grouped as <strong>Other Expenses</strong>.
          </div>

          <div className="w-full h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Category Breakdown
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
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
                <Tooltip formatter={(value) => [`AUD $${value}`, "Category"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Grouped Expenses */}
          <div className="flex flex-col gap-5">
            {Object.entries(groupedByDate).map(([date, categories]) => {
              const totalForDay = Object.values(categories)
                .flat()
                .reduce((sum, e) => sum + e.amount, 0);
              return (
                <div
                  key={date}
                  className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden"
                >
                  <div className="bg-gray-100 w-full px-4 py-3 flex justify-between items-center">
                    <h2 className="font-semibold text-lg text-gray-800">
                      {date}
                    </h2>
                    <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                      Total: AUD ${totalForDay.toFixed(2)}
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
                        className="block cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-none px-6 py-4 transition-colors"
                      >
                        <h3
                          className="flex items-center gap-3 font-semibold text-base mb-2"
                          style={{ color: categoryColor }}
                        >
                          <span className="text-xl">
                            {getCategoryIcon(category)}
                          </span>
                          <span>
                            {category} –{" "}
                            <span className="font-bold">
                              AUD ${totalForCategory.toFixed(2)}
                            </span>
                          </span>
                        </h3>
                        <ul className="pl-6 text-sm text-gray-700 space-y-2">
                          {expenses.map((expense) => (
                            <li
                              key={expense.id}
                              className="flex justify-between border-b border-gray-100 py-2 last:border-none hover:bg-gray-50 px-2 rounded"
                            >
                              <span className="font-medium">
                                {expense.name}
                              </span>
                              <span
                                className="font-bold"
                                style={{ color: categoryColor }}
                              >
                                AUD ${expense.amount.toFixed(2)}
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
