"use client";

import React from "react";
import { CreditCard, PieChart, Bell, Database, BarChart2 } from "lucide-react";

const features = [
  {
    title: "Expense Tracking",
    description:
      "Track your daily expenses easily with detailed categorization.",
    icon: CreditCard,
  },
  {
    title: "Budget Management",
    description: "Create and monitor budgets to stay on top of your spending.",
    icon: PieChart,
  },
  {
    title: "Real-time Notifications",
    description:
      "Receive instant alerts on expense limits, approvals, and updates.",
    icon: Bell,
  },

  {
    title: "Reports & Analytics",
    description: "Visualize your spending patterns.",
    icon: BarChart2,
  },
  {
    title: "Secure Data Backup",
    description: "Your data is backed up safely in the cloud with encryption.",
    icon: Database,
  },
];

const FeatureCard = () => {
  return (
    <section className="max-w-5xl mx-auto p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map(({ title, description, icon: Icon }) => (
        <div
          key={title}
          className="flex flex-col items-center p-5 border rounded-lg shadow hover:shadow-lg transition-shadow bg-white"
        >
          <Icon className="text-[#009ffc] w-12 h-12 mb-4" />
          <h3 className="text-lg text-primary font-semibold mb-2 text-center tracking-tight">
            {title}
          </h3>
          <p className="text-gray-600 text-center tracking-wide">
            {description}
          </p>
        </div>
      ))}
    </section>
  );
};

export default FeatureCard;
