"use client";

import React from "react";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 text-gray-700 pt-6 pb-12 px-5">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
        <h2 className="text-xl font-semibold text-primary">Expensigo</h2>
        <p className="text-center text-sm max-w-md flex flex-col md:flex-row items-center justify-center gap-2">
          For any inquiries, please reach out to us at
          <a
            href="mailto:dpthk2024@gmail.com"
            className="inline-flex items-center text-primary hover:underline"
          >
            <Mail className="w-5 h-5 mr-1" />
            dpthk2024@gmail.com
          </a>
        </p>

        <p className="text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} Expensigo. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
