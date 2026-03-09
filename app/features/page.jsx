import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Zap,
  BarChart3,
  Shield,
  Users,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Features",
  description: "ExpensiGo features - AI-powered insights, smart analytics, budget tracking, and more.",
};

export default function FeaturesPage() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Intelligent spending recommendations and financial insights powered by advanced AI.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Smart Analytics",
      description: "Visualise spending patterns with charts and predictive analysis.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Bank-Level Security",
      description: "Enterprise-grade encryption and security for your financial data.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-User Support",
      description: "Secure authentication with user-specific data isolation.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Budget Management",
      description: "Create budgets, track expenses, and view remaining balance in real time.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">ExpensiGo</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Features</h1>
        <p className="text-xl text-gray-600 mb-12">
          Everything you need to take control of your finances.
        </p>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
