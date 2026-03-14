"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Page() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      window.location.href = "/dashboard";
    }
  }, [isLoaded, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <SignIn
          routing="path"
          redirectUrl="/dashboard"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
              socialButtonsBlockButton:
                "border border-gray-300 text-gray-700 hover:bg-gray-100",
              footerActionLink: "text-blue-600 hover:text-blue-700",
              card: "shadow-lg rounded-lg p-8",
            },
            variables: {
              colorPrimary: "#2563eb",
              colorText: "#374151",
              colorBackground: "#ffffff",
              fontSize: "1rem",
              borderRadius: "0.5rem",
            },
          }}
        />
      </div>
    </div>
  );
}
