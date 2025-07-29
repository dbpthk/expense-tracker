import { UserButton } from "@clerk/nextjs";
import React from "react";

const DashboardHeader = () => {
  return (
    <div className="h-30 md:shadow-md flex items-center justify-end pr-10">
      <div className="hidden md:flex">
        <UserButton className="cursor-pointer " />
      </div>
    </div>
  );
};

export default DashboardHeader;
