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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            No Data Available
          </h2>
          <p className="text-sm text-center max-w-sm text-gray-500">
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
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Budget:{" "}
              <span className="font-medium text-blue-600">
                ${budget.budget?.toLocaleString()}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Spent:{" "}
              <span className="font-medium text-red-600">
                ${budget.spent?.toLocaleString()}
              </span>
            </p>
            <p className="text-sm text-gray-600">
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-bold text-xl text-gray-800">
            Budget vs Spending
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Visualize your budget allocation and spending patterns across budgets.
        </p>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
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
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-sm text-gray-600 font-medium">Budget</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600 font-medium">Spent</span>
        </div>
      </div>
    </div>
  );
};

export default BarChartDashboard;
