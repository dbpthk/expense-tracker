import "./globals.css";
import { Outfit } from "next/font/google";
import Provider from "./Provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: {
    default: "ExpensiGo - AI-Powered Expense Tracking & Budget Management",
    template: "%s | ExpensiGo",
  },
  description:
    "Take control of your finances with ExpensiGo's AI-powered expense tracking. Smart budgeting, automated categorization, and intelligent insights to help you save money and achieve your financial goals.",
  keywords: [
    "expense tracker",
    "budget management",
    "AI finance",
    "personal finance",
    "money management",
    "financial planning",
    "expense tracking app",
    "budget planner",
  ],
  authors: [{ name: "ExpensiGo Team" }],
  creator: "ExpensiGo",
  publisher: "ExpensiGo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://expensigo.app"),
  openGraph: {
    title: "ExpensiGo - AI-Powered Expense Tracking & Budget Management",
    description:
      "Take control of your finances with ExpensiGo's AI-powered expense tracking. Smart budgeting, automated categorization, and intelligent insights.",
    url: "https://expensigo.app",
    siteName: "ExpensiGo",
    images: [
      {
        url: "/dashboard.png",
        width: 1200,
        height: 630,
        alt: "ExpensiGo Dashboard - AI-Powered Expense Tracking",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExpensiGo - AI-Powered Expense Tracking",
    description:
      "Take control of your finances with AI-powered expense tracking and smart budgeting tools.",
    images: ["/dashboard.png"],
    creator: "@expensigo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "./favicon.png",
    shortcut: "./favicon.png",
    apple: "./favicon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
