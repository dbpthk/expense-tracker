"use client";
import Header from "./_componets/Header";
import Hero from "./_componets/Hero";
import Dashboard from "./(routes)/dashboard/page";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);
  if (!isLoaded)
    return <div className="w-full h-full bg-orange-50 animate pulse"></div>;
  return (
    <div>
      <Header />
      <Hero />
    </div>
  );
}
