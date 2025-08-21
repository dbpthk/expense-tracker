"use client";

import React, { useMemo, useState, useEffect } from "react";
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
  Legend,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  BarChart3,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const Expense = () => {
  const { subscription } = useSubscription();
  const { user } = useUser();
  const [monthOffset, setMonthOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [chartView, setChartView] = useState("daily");

  // Dynamic data from database
  const [expenseData, setExpenseData] = useState({
    budgets: [],
    expenses: [],
    categories: {},
    totals: {
      totalBudget: "0",
      totalSpent: "0",
      totalBudgets: 0,
      totalExpenses: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(0);

  // Feature access check - allow exports for all users during beta
  const featureAccess = {
    canExport: true, // Allow exports for all users during beta testing
  };

  const currentMonth = moment().add(monthOffset, "months").format("MMMM YYYY");
  const currentMonthYear = moment()
    .add(monthOffset, "months")
    .format("YYYY-MM");

  // Fetch data from database
  const fetchExpenseData = async (forceRefresh = false) => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const now = Date.now();
    if (!forceRefresh && now - lastFetch < 5000) return; // 5 second cache

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/expense-data?email=${user.primaryEmailAddress.emailAddress}`
      );

      if (response.ok) {
        const data = await response.json();
        setExpenseData(data);
        setLastFetch(now);
      } else {
        toast.error("Failed to fetch expense data");
      }
    } catch (error) {
      console.error("Error fetching expense data:", error);
      toast.error("Failed to fetch expense data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount and when user changes
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchExpenseData(true);
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  // Refresh data when month changes
  useEffect(() => {
    if (user && expenseData.expenses.length > 0) {
      fetchExpenseData(true);
    }
  }, [monthOffset]);

  const filteredExpenses = useMemo(() => {
    return expenseData.expenses.filter((expense) => {
      // Parse the actual API date format (YYYY-MM-DD)
      const expenseDate = moment(expense.createdAt, "YYYY-MM-DD");
      const isCurrentMonth = expenseDate.format("YYYY-MM") === currentMonthYear;

      const matchesSearch =
        expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.category &&
          expense.category.toLowerCase().includes(searchTerm.toLowerCase()));

      return isCurrentMonth && matchesSearch;
    });
  }, [expenseData.expenses, currentMonthYear, searchTerm]);

  const totalCurrentMonth = useMemo(() => {
    return filteredExpenses.reduce(
      (sum, exp) => sum + parseFloat(exp.amount || 0),
      0
    );
  }, [filteredExpenses]);

  const totalTillDate = useMemo(() => {
    return expenseData.expenses.reduce(
      (sum, exp) => sum + parseFloat(exp.amount || 0),
      0
    );
  }, [expenseData.expenses]);

  const groupedByDate = useMemo(() => {
    const grouped = {};
    filteredExpenses.forEach((expense) => {
      // Convert YYYY-MM-DD to DD/MM/YYYY for display
      const displayDate = moment(expense.createdAt, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );

      if (!grouped[displayDate]) grouped[displayDate] = {};
      if (!grouped[displayDate][expense.category])
        grouped[displayDate][expense.category] = [];
      grouped[displayDate][expense.category].push(expense);
    });
    return grouped;
  }, [filteredExpenses]);

  const chartData = useMemo(() => {
    if (chartView === "daily") {
      // Daily spending view
      const dayTotals = {};
      filteredExpenses.forEach((expense) => {
        const displayDate = moment(expense.createdAt, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        );

        if (!dayTotals[displayDate]) dayTotals[displayDate] = 0;
        dayTotals[displayDate] += parseFloat(expense.amount || 0);
      });
      return Object.entries(dayTotals).map(([day, total]) => ({
        date: day,
        amount: total,
      }));
    } else {
      // Monthly spending view (last 6 months)
      const monthTotals = {};
      for (let i = 5; i >= 0; i--) {
        const month = moment().subtract(i, "months");
        const monthKey = month.format("MMM YYYY");
        monthTotals[monthKey] = 0;
      }

      // Calculate totals for each month
      expenseData.expenses.forEach((expense) => {
        const expenseDate = moment(expense.createdAt, "YYYY-MM-DD");
        const monthKey = expenseDate.format("MMM YYYY");
        if (monthTotals.hasOwnProperty(monthKey)) {
          monthTotals[monthKey] += parseFloat(expense.amount || 0);
        }
      });

      return Object.entries(monthTotals).map(([month, total]) => ({
        date: month,
        amount: total,
      }));
    }
  }, [filteredExpenses, expenseData.expenses, chartView]);

  const pieData = useMemo(() => {
    const totals = {};
    filteredExpenses.forEach((expense) => {
      if (!totals[expense.category]) totals[expense.category] = 0;
      totals[expense.category] += parseFloat(expense.amount || 0);
    });
    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredExpenses]);

  // Dynamic category functions - NO HARDCODING
  const getCategoryColor = (category) => {
    if (expenseData.categories[category]) {
      return expenseData.categories[category].color;
    }
    return "#6B7280"; // Default gray
  };

  const getCategoryIcon = (category) => {
    if (expenseData.categories[category]) {
      return expenseData.categories[category].icon;
    }
    return "❓"; // Default question mark
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading expense data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header + Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Expenses Overview – {currentMonth}
        </h2>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={() => fetchExpenseData(true)}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Loader2 className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>

          {/* Export Button - Redirect to Settings */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => (window.location.href = "/dashboard/settings")}
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
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
          placeholder="Search expense name or category..."
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
          {expenseData.expenses.length > 0 && (
            <p className="text-sm mt-2 text-gray-500">
              Try adjusting the month or search term to see your expenses.
            </p>
          )}
          {expenseData.expenses.length === 0 && (
            <p className="text-sm mt-2 text-gray-500">
              No expenses found in the system. Try refreshing the data.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart with Toggle */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold">Spending Overview</h3>

                {/* Chart Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <Button
                    variant={chartView === "daily" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setChartView("daily")}
                    className="flex items-center gap-2 text-xs px-3 py-1 h-8"
                  >
                    <Calendar className="w-3 h-3" />
                    Daily
                  </Button>
                  <Button
                    variant={chartView === "monthly" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setChartView("monthly")}
                    className="flex items-center gap-2 text-xs px-3 py-1 h-8"
                  >
                    <BarChart3 className="w-3 h-3" />
                    Monthly
                  </Button>
                </div>
              </div>

              <ResponsiveContainer
                width="100%"
                height={250}
                className="min-h-[250px]"
              >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    angle={chartView === "monthly" ? -45 : 0}
                    textAnchor={chartView === "monthly" ? "end" : "middle"}
                    height={chartView === "monthly" ? 80 : 60}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value) => [`AUD $${value}`, "Amount"]}
                    labelStyle={{ fontSize: "12px" }}
                  />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Chart Info */}
              <div className="text-xs text-gray-500 mt-2 text-center">
                {chartView === "daily"
                  ? `Showing daily spending for ${currentMonth}`
                  : "Showing monthly spending for last 6 months"}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-4 sm:p-6 pb-15 rounded-lg shadow-sm border">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Category Breakdown
              </h3>
              <ResponsiveContainer
                width="100%"
                height={240}
                className="min-h-[240px]"
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={55}
                    dataKey="value"
                    label={({ name, percent }) => {
                      // Show labels for more segments with better visibility
                      if (percent > 0.08) {
                        // Lower threshold to show more labels
                        return `${(percent * 100).toFixed(0)}%`;
                      }
                      return null;
                    }}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getCategoryColor(entry.name)}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `AUD $${value.toFixed(2)}`,
                      name,
                    ]}
                    labelStyle={{ fontSize: "12px" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={50}
                    content={({ payload }) => (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {/* Legend Title */}
                        <div className="text-center mb-2">
                          <h4 className="text-sm font-semibold text-gray-700">
                            Expense Categories
                          </h4>
                        </div>
                        {/* Legend Items */}
                        <div className="flex flex-wrap justify-center gap-2">
                          {payload?.map((entry, index) => (
                            <div
                              key={`legend-${index}`}
                              className="flex items-center gap-1"
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-xs text-gray-600 font-medium max-w-[80px] truncate">
                                {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grouped Expenses */}
          <div className="flex flex-col gap-5">
            {Object.entries(groupedByDate).map(([date, categories]) => {
              const totalForDay = Object.values(categories)
                .flat()
                .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
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
                      (sum, e) => sum + parseFloat(e.amount || 0),
                      0
                    );
                    const categoryColor = getCategoryColor(category);

                    return (
                      <Link
                        key={category}
                        href={
                          budgetId ? `/dashboard/expenses/${budgetId}` : "#"
                        }
                        className="block cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-none px-4 sm:px-6 py-4 transition-colors"
                      >
                        <h3
                          className="flex items-center gap-3 font-semibold text-base mb-2"
                          style={{ color: categoryColor }}
                        >
                          <span className="text-xl">
                            {getCategoryIcon(category)}
                          </span>
                          <span>
                            {category || "Unknown Category"} –{" "}
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
                                AUD $
                                {parseFloat(expense.amount || 0).toFixed(2)}
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
