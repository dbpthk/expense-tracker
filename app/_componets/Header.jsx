import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="px-5 py-4 flex items-center justify-between shadow-sm">
      <img src={"./logo.svg"} alt="logo" width={200} />
      <Button>Get Started</Button>
    </div>
  );
};

export default Header;
