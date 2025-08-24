"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart as PieChartIcon, TrendingUp } from "lucide-react";

const PieChartDashboard = ({ budgetList, expensesList }) => {
  if (!budgetList || budgetList.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12">
          <PieChartIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
            No Data Available
          </h2>
          <p className="text-xs sm:text-sm text-center max-w-sm text-gray-500">
            Create budgets to visualize your financial allocation across
            different budgets.
          </p>
        </div>
      </div>
    );
  }

  const data = budgetList.map((budget) => ({
    name: budget.name,
    value: Number(budget.amount),
    color: budget.color,
    icon: budget.icon,
    spent: Number(budget.totalSpend || 0),
    remaining: Number(budget.amount) - Number(budget.totalSpend || 0),
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl sm:text-2xl">{data.payload.icon}</span>
            <p className="font-semibold text-gray-900 text-sm sm:text-base">
              {data.name}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-600">
              Budget:{" "}
              <span className="font-medium text-blue-600">
                ${data.value?.toLocaleString()}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Spent:{" "}
              <span className="font-medium text-red-600">
                ${data.payload.spent?.toLocaleString()}
              </span>
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Remaining:{" "}
              <span className="font-medium text-green-600">
                ${data.payload.remaining?.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => (
    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
      {/* Legend Title */}
      <div className="text-center mb-3">
        <h4 className="text-sm font-semibold text-gray-700">
          Budget Categories
        </h4>
      </div>
      {/* Legend Items */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {payload && payload.length > 0 ? (
          payload.map((entry, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-1 sm:gap-2 bg-gray-50 px-2 py-1 rounded"
            >
              <div
                className="w-3 h-3 rounded-full border border-gray-200"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-700 font-medium max-w-[80px] sm:max-w-[100px] truncate">
                {entry.value}
              </span>
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500">No budget data available</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="font-bold text-lg sm:text-xl text-gray-800">
            Budget Distribution
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">
          See how your total budget is allocated across different budgets.
        </p>
      </div>

      <div className="w-full h-[450px] sm:[270px] md:h-[370px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => {
                // Show labels for all segments
                return `${(percent * 100).toFixed(0)}%`;
              }}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              stroke="#fff"
              strokeWidth={1}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold text-blue-600">
            $
            {budgetList
              .reduce((sum, budget) => sum + Number(budget.amount), 0)
              .toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Total Budget</div>
        </div>
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold text-red-600">
            $
            {budgetList
              .reduce((sum, budget) => sum + Number(budget.totalSpend || 0), 0)
              .toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Total Spent</div>
        </div>
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold text-green-600">
            {budgetList.length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Budgets</div>
        </div>
      </div>
    </div>
  );
};

export default PieChartDashboard;
