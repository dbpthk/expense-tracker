"use client";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

const BarChartDashboard = ({ budgetList }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 640);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Add 'remaining' field = budget amount - spent (safe to 0 min)
  const chartData = budgetList.map((item) => ({
    ...item,
    remaining: Math.max(0, item.amount - (item.totalSpend || 0)),
    totalSpend: item.totalSpend || 0,
  }));

  const CustomLegend = () => {
    return (
      <ul className="flex gap-4 px-4 text-sm">
        <li className="flex items-center gap-2">
          <span
            className="w-3 h-3 inline-block rounded-sm"
            style={{
              backgroundColor: "#000000" /* you can pick a color here */,
            }}
          ></span>
          <span>Spent So Far</span>
        </li>
        <li className="flex items-center gap-2">
          <span
            className="w-3 h-3 inline-block rounded-sm"
            style={{ backgroundColor: "#cccccc" /* lighter shade */ }}
          ></span>
          <span>Remaining Budget</span>
        </li>
      </ul>
    );
  };

  return (
    <>
      {/* If budgetList is empty, show a message */}
      {budgetList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 17L6 13.25M9.75 17L13.5 13.25M9.75 17v-9"
            />
          </svg>
          <h2 className="text-lg font-semibold mb-1">
            No Budget Data Available
          </h2>
          <p className="text-sm text-center max-w-xs">
            There is no budget data to display the bar chart. Please add some
            budgets to get started.
          </p>
        </div>
      ) : (
        <div className="w-fit sm:w-full border rounded-lg py-5 pr-5 flex flex-col gap-5">
          <div>
            <h2 className="font-bold pl-5">Your Activity</h2>
            <p className="pl-5 text-sm text-muted-foreground">
              Tap or click a bar to see how much you've spent.
            </p>
          </div>

          <div className="min-w-[340px] sm:w-[80%] px-5">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                className="outline-none"
                data={chartData}
                margin={{ top: 5, right: 5, bottom: 20 }}
                barCategoryGap={isSmallScreen ? 20 : 10}
              >
                <XAxis
                  dataKey="name"
                  angle={-75}
                  tick={{ fontSize: isSmallScreen ? 8 : 10 }}
                  height={90}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: isSmallScreen ? 8 : 10 }} />
                <Tooltip
                  contentStyle={{ fontSize: "9px" }}
                  labelStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`$${value}`, name]}
                />
                <CustomLegend />

                {/* Spent So Far (100% opacity) */}
                <Bar
                  dataKey="totalSpend"
                  name="Spent So Far"
                  stackId="a"
                  barSize={isSmallScreen ? 5 : 10}
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-spent-${index}`}
                      fill={
                        entry.totalSpend > 0
                          ? entry.color || "#22c55e"
                          : "transparent"
                      }
                    />
                  ))}
                </Bar>

                {/* Remaining Budget (same color with low opacity) */}
                <Bar
                  dataKey="remaining"
                  name="Remaining Budget"
                  stackId="a"
                  barSize={isSmallScreen ? 10 : 20}
                >
                  {chartData.map((entry, index) => {
                    const colorWithOpacity = entry.color
                      ? `${entry.color}66` // 40% opacity
                      : "#86efac66";
                    return (
                      <Cell
                        key={`cell-remaining-${index}`}
                        fill={colorWithOpacity}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default BarChartDashboard;
