import React from "react";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";

const BarChartDashboard = ({ budgetList }) => {
  return (
    <div className="border rounded-lg p-5">
      <h2 className="font-bold ">Activity</h2>
      <BarChart
        width={500}
        height={300}
        data={budgetList}
        margin={{ top: 5, left: 5, right: 5, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalSpend" stackId="a" fill="#009857" />
        <Bar dataKey="amount" stackId="a" fill="#89d6a4" />
      </BarChart>
    </div>
  );
};

export default BarChartDashboard;
