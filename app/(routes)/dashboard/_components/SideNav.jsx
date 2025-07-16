import React from "react";
import Image from "next/image";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const SideNav = () => {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
    },
    {
      id: 2,
      name: "Budgets",
      icon: PiggyBank,
    },
    {
      id: 3,
      name: "Expenses",
      icon: ReceiptText,
    },
    {
      id: 4,
      name: "Upgrade",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="h-screen p-5">
      <Image src={"./logo.svg"} width={200} height={100} alt="logo" />

      <div className="mt-5">
        {menuList.map((menu) => (
          <h2 className="flex items-center gap-2 text-gray-700 font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-green-100">
            <menu.icon />
            {menu.name}
          </h2>
        ))}
      </div>
      <div className="fixed bottom-10 p-5 flex gap-4 item-center font-medium text-gray-700">
        <UserButton />
        Profile
      </div>
    </div>
  );
};

export default SideNav;
