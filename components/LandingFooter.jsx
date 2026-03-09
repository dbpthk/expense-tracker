"use client";

import Link from "next/link";
import { useState } from "react";
import { TrendingUp } from "lucide-react";

export default function LandingFooter() {
  const [showContact, setShowContact] = useState(false);

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">ExpensiGo</span>
            </div>
            <p className="text-gray-400">
              The intelligent way to manage your finances and achieve your
              financial goals.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/upgrade"
                  className="hover:text-white transition-colors text-blue-400 font-medium"
                >
                  Pro Plan - AUD 2.99/month
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setShowContact(!showContact)}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
            {showContact && (
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Please Email:</p>
                <a
                  href="mailto:dpthk2024@gmail.com"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  dpthk2024@gmail.com
                </a>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} ExpensiGo. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-6 flex-wrap"></div>
        </div>
      </div>
    </footer>
  );
}
