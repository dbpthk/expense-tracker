"use client";
import React from "react";
import { useEffect } from "react";
import { Mail } from "lucide-react";
import EmailLink from "../_components/EmailLink";

const Page = () => {
  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = "hidden";

    // Cleanup - enable scroll when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div className=" h-screen overflow-hidden flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        🚧 This app is currently in Beta
      </h1>
      <p className="text-lg text-gray-700 max-w-xl mb-6">
        We're working hard to bring you new features and improvements. Thank you
        for being an early user and testing the app with us!
      </p>
      <p className="text-md text-gray-600 mb-8">
        Upgrades and full features are coming soon. Stay tuned!
      </p>
      {/* Contact Section */}
      <div className="mt-8 max-w-md text-center">
        <p className="mb-2 text-gray-700">
          For any suggestions or inquiries, feel free to reach out to us at
        </p>
        <EmailLink />
      </div>
    </div>
  );
};

export default Page;
