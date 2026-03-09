import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";

export const metadata = {
  title: "About",
  description: "Learn about ExpensiGo - AI-powered expense tracking and budget management.",
};

export default function AboutPage() {
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About ExpensiGo</h1>
        <p className="text-xl text-gray-600 mb-8">
          ExpensiGo is a modern full-stack expense tracking and budget management application built with Next.js. We help users manage budgets, track categorised expenses, and visualise financial data through an intuitive, responsive interface.
        </p>
        <p className="text-gray-600 mb-8">
          Our mission is to make personal finance simple and accessible. Whether you&apos;re tracking daily spending or planning long-term budgets, ExpensiGo provides the tools you need to achieve your financial goals.
        </p>
        <p className="text-gray-600">
          Built with cutting-edge technology including AI-powered insights, secure authentication, and real-time analytics.
        </p>
      </main>
    </div>
  );
}
