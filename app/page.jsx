"use client";
import Header from "./_componets/Header";
import Hero from "./_componets/Hero";
import Dashboard from "./(routes)/dashboard/page";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  return (
    <div>
      <Header />
      <Hero />
      {isSignedIn ? <Dashboard /> : null}
    </div>
  );
}
