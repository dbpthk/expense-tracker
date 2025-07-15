import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded",
              socialButtonsBlockButton:
                "border border-gray-300 text-gray-700 hover:bg-gray-100",
              footerActionLink: "text-green-600 hover:text-green-700",
              card: "shadow-lg rounded-lg p-8",
            },
            variables: {
              colorPrimary: "#16A34A",
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
