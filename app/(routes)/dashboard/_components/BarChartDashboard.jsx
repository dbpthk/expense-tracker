"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const BarChartDashboard = ({ budgetList }) => {
  if (!budgetList || budgetList.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12">
          <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
            No Data Available
          </h2>
          <p className="text-xs sm:text-sm text-center max-w-sm text-gray-500">
            Create your first budget to start visualizing your spending patterns
            and financial goals.
          </p>
        </div>
      </div>
    );
  }

  const data = budgetList.map((budget) => ({
    name: budget.name,
    budget: Number(budget.amount),
    spent: Number(budget.totalSpend || 0),
    remaining: Number(budget.amount) - Number(budget.totalSpend || 0),
    color: budget.color,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const budget = payload[0]?.payload;
      return (
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
            {label}
          </p>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-600">
              Budget:{" "}
              <span className="font-medium text-blue-600">
                ${budget.budget?.toLocaleString()}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Spent:{" "}
              <span className="font-medium text-red-600">
                ${budget.spent?.toLocaleString()}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Remaining:{" "}
              <span className="font-medium text-green-600">
                ${budget.remaining?.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="font-bold text-lg sm:text-xl text-gray-800">
            Budget vs Spending
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">
          Visualize your budget allocation and spending patterns across budgets.
        </p>
      </div>

      <div className="w-full h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Budget Bars */}
            <Bar
              dataKey="budget"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              opacity={0.8}
              name="Budget"
            >
              {data.map((entry, index) => (
                <Cell key={`budget-${index}`} fill="#3B82F6" />
              ))}
            </Bar>

            {/* Spent Bars */}
            <Bar
              dataKey="spent"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
              opacity={0.9}
              name="Spent"
            >
              {data.map((entry, index) => (
                <Cell key={`spent-${index}`} fill="#EF4444" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded"></div>
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            Budget
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div>
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            Spent
          </span>
        </div>
      </div>
    </div>
  );
};

export default BarChartDashboard;
