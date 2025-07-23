import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

const BarChartDashboard = ({ budgetList }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 640); // Tailwind 'sm' breakpoint

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="w-fit sm:w-full border rounded-lg py-5 pr-5 flex flex-col gap-5">
      <h2 className="font-bold pl-5 ">Activity</h2>
      <div className="w-[350px] sm:w-[80%]">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={budgetList}
            margin={{ top: 5, right: 5, bottom: 5 }}
            barCategoryGap={isSmallScreen ? 20 : 10}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: isSmallScreen ? 10 : 14 }}
            />
            <YAxis tick={{ fontSize: isSmallScreen ? 10 : 14 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: isSmallScreen ? 10 : 14 }} />
            <Bar
              dataKey="totalSpend"
              name="Spent So Far"
              stackId="a"
              fill="#009857"
              barSize={isSmallScreen ? 20 : 40}
            />
            <Bar
              dataKey="amount"
              name="Your Budget"
              stackId="a"
              fill="#89d6a4"
              barSize={isSmallScreen ? 20 : 40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartDashboard;
