"use client";
import { SignIn, useSignIn, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const DEMO_EMAIL = "demo@expensigo.com";
const DEMO_PASSWORD = "Demo@expensigo";

export default function Page() {
  const { user, isLoaded } = useUser();
  const { signIn } = useSignIn();
  const searchParams = useSearchParams();
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);
  const [autoLoginFailed, setAutoLoginFailed] = useState(false);
  const attemptedRef = useRef(false);

  const isDemoMode = searchParams.get("demo") === "user";

  const initialValues = useMemo(() => {
    if (isDemoMode) {
      return {
        emailAddress: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      };
    }
    return undefined;
  }, [isDemoMode]);

  useEffect(() => {
    if (isLoaded && user) {
      window.location.href = "/dashboard";
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (
      !isLoaded ||
      user ||
      !signIn ||
      !isDemoMode ||
      attemptedRef.current ||
      autoLoginFailed
    ) {
      return;
    }

    const doAutoLogin = async () => {
      attemptedRef.current = true;
      setAutoLoginAttempted(true);

      const { error } = await signIn.password({
        emailAddress: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });

      if (error) {
        setAutoLoginFailed(true);
        setAutoLoginAttempted(false);
        attemptedRef.current = false;
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) return;
            window.location.href = decorateUrl("/dashboard") ?? "/dashboard";
          },
        });
      } else {
        setAutoLoginFailed(true);
        setAutoLoginAttempted(false);
        attemptedRef.current = false;
      }
    };

    doAutoLogin();
  }, [isLoaded, user, signIn, isDemoMode, autoLoginFailed]);

  if (isLoaded && isDemoMode && autoLoginAttempted && !autoLoginFailed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-600">Signing you in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <SignIn
          initialValues={initialValues}
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
