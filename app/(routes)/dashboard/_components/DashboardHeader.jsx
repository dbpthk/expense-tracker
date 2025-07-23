import { UserButton } from "@clerk/nextjs";
import React from "react";

const DashboardHeader = () => {
  return (
    <div className="py-5 px-8 border-b shadow-sm flex justify-between">
      <div></div>
      <div>
        <UserButton />
      </div>
    </div>
  );
};

export default DashboardHeader;
