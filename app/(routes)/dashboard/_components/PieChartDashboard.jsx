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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <PieChartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            No Data Available
          </h2>
          <p className="text-sm text-center max-w-sm text-gray-500">
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
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{data.payload.icon}</span>
            <p className="font-semibold text-gray-900">{data.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Budget:{" "}
              <span className="font-medium text-blue-600">
                ${data.value?.toLocaleString()}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Spent:{" "}
              <span className="font-medium text-red-600">
                ${data.payload.spent?.toLocaleString()}
              </span>
            </p>
            <p className="text-sm text-gray-600">
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
    <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-gray-100">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600 font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <PieChartIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-bold text-xl text-gray-800">
            Budget Distribution
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          See how your total budget is allocated across different budgets.
        </p>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            $
            {budgetList
              .reduce((sum, budget) => sum + Number(budget.amount), 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Budget</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            $
            {budgetList
              .reduce((sum, budget) => sum + Number(budget.totalSpend || 0), 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {budgetList.length}
          </div>
          <div className="text-sm text-gray-600">Budgets</div>
        </div>
      </div>
    </div>
  );
};

export default PieChartDashboard;
