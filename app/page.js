import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divide } from "lucide-react";
import Header from "./_componets/Header";
import Hero from "./_componets/Hero";
import Dashboard from "./(routes)/dashboard/page";

export default function Home() {
  console.log(process.env.DATABASE_URL);
  return (
    <div>
      <Header />
      <Hero />
      <Dashboard />
    </div>
  );
}
