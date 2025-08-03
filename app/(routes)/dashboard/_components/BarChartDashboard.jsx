"use client";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
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

  const CustomLegend = () => {
    return (
      <ul className="flex gap-4 px-4 text-sm">
        <li className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 inline-block rounded-sm"></span>
          <span>Spent So Far</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 inline-block rounded-sm"></span>
          <span>Your Budget</span>
        </li>
      </ul>
    );
  };

  return (
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
            className="outline-none "
            data={budgetList}
            margin={{ top: 5, right: 5, bottom: 5 }}
            barCategoryGap={isSmallScreen ? 20 : 10}
          >
            <XAxis
              dataKey="name"
              angle={-45}
              tick={{ fontSize: isSmallScreen ? 8 : 12 }}
              height={90}
              textAnchor="end"
            />
            <YAxis tick={{ fontSize: isSmallScreen ? 8 : 12 }} />
            {/* <Tooltip /> */}
            <Tooltip
              contentStyle={{ fontSize: "9px" }} // Overall tooltip box
              labelStyle={{ fontSize: "12px" }} // The label (e.g., category name)
            />

            {/* Bar for "Spent So Far" with color shades */}
            <Bar
              dataKey="totalSpend"
              name="Spent So Far"
              className="text-chart-1"
              stackId="a"
              barSize={isSmallScreen ? 10 : 20}
            >
              {budgetList.map((entry, index) => (
                <Cell
                  key={`cell-spend-${index}`}
                  fill={entry.color || "#009857"}
                />
              ))}
            </Bar>

            {/* Bar for "Your Budget" with lighter color shades */}
            <Bar
              dataKey="amount"
              name="Your Budget"
              stackId="a"
              barSize={isSmallScreen ? 10 : 20}
            >
              {budgetList.map((entry, index) => (
                <Cell
                  key={`cell-budget-${index}`}
                  fill={
                    entry.color
                      ? `${entry.color}99` // apply ~60% opacity as a shade
                      : "#89d6a4"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartDashboard;
