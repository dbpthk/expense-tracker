import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divide } from "lucide-react";
import Header from "./_componets/Header";
import Hero from "./_componets/Hero";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Dashboard />
    </div>
  );
}
