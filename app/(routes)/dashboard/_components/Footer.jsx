"use client";

import React from "react";
import { Mail } from "lucide-react";
import EmailLink from "./EmailLink";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 text-gray-700 pt-6 pb-12 px-5">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
        <h2 className="text-xl font-semibold text-primary">Expensigo</h2>
        <div className="text-center text-sm max-w-md flex flex-col md:flex-row items-center justify-center gap-2">
          For any inquiries, please reach out to us at
          <EmailLink />
        </div>

        <p className="text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} Expensigo. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
