import React from "react";
import NavBar from "./_components/NavBar.jsx";
import DashboardClientWrapper from "./DashboardClientWrapper.jsx";
import Footer from "./_components/Footer.jsx";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      {/* Sidebar / Nav */}
      <div className="block lg:fixed top-0 left-0">
        <NavBar />
      </div>

      {/* Main content */}
      <div className="lg:ml-72">
        <DashboardClientWrapper>{children}</DashboardClientWrapper>
      </div>
    </div>
  );
};

export default DashboardLayout;
