import React from "react";
import SideNav from "./_components/SideNav";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <div className="fixed hidden md:block md:w-64 border shadow-sm">
        <SideNav />
      </div>

      <div className="md:ml-64 bg-blue-400">{children}</div>
    </div>
  );
};

export default DashboardLayout;
