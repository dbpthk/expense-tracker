"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();

  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute) return null; // Hide header on dashboard pages

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-3 flex items-center justify-between backdrop-blur-md bg-white/70 shadow-sm border-b">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="logo"
          width={150}
          height={60}
          className="object-contain max-w-[120px] md:max-w-[150px]"
        />
      </Link>

      {isSignedIn ? (
        <UserButton className="hidden md:block" />
      ) : (
        <Link href={"/sign-in"}>
          <Button className="hover:bg-green-800 cursor-pointer">
            Get Started
          </Button>
        </Link>
      )}
    </header>
  );
};

export default Header;
