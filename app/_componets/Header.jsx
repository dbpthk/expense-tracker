import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="px-5 py-4 flex items-center justify-between shadow-md">
      <Image src={"./logo.svg"} alt="logo" width={200} height={100} />
      <Button className="hover:bg-green-800 cursor-pointer">Get Started</Button>
    </div>
  );
};

export default Header;
