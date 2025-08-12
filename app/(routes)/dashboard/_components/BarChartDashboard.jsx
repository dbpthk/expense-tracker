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
              // Use a custom shape to avoid rendering bars when value is 0
              // or better: set totalSpend to 0 if it's falsy (already done in data mapping)
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
                // Add opacity to hex color by appending '66' (40% opacity)
                const colorWithOpacity = entry.color
                  ? `${entry.color}66`
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
  );
};

export default BarChartDashboard;
