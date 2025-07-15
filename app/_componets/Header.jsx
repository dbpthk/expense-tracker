"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const Header = () => {
  const { user, isSignedIn } = useUser();

  return (
    <div className="px-5 py-4 flex items-center justify-between shadow-md">
      <Image src={"./logo.svg"} alt="logo" width={200} height={100} />
      {isSignedIn ? (
        <UserButton />
      ) : (
        <Link href={"/sign-up"}>
          <Button className="hover:bg-green-800 cursor-pointer">
            Get Started
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Header;
