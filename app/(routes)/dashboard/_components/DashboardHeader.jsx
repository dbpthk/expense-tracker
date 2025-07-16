import { UserButton } from "@clerk/nextjs";
import React from "react";

const DashboardHeader = () => {
  return (
    <div className="p-5 border-b shadow-sm flex justify-between">
      <div>serchbar</div>
      <div>
        <UserButton />
      </div>
    </div>
  );
};

export default DashboardHeader;
