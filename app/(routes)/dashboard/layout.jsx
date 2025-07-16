import React from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader.jsx";
const DashboardLayout = ({ children }) => {
  return (
    <div>
      <div className="fixed hidden md:block md:w-64 border shadow-sm">
        <SideNav />
      </div>

      <div className="md:ml-64 ">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
