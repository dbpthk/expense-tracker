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

  return (
    <div className="w-fit sm:w-full border rounded-lg py-5 pr-5 flex flex-col gap-5">
      <h2 className="font-bold pl-5">Activity</h2>
      <div className="min-w-[300px] sm:w-[80%] px-5">
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
            <Tooltip height={20} />
            <Legend wrapperStyle={{ fontSize: isSmallScreen ? 8 : 12 }} />

            {/* Bar for "Spent So Far" with color shades */}
            <Bar
              dataKey="totalSpend"
              name="Spent So Far"
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
