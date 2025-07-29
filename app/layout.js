import "./globals.css";
import { Outfit } from "next/font/google";
import Provider from "./Provider";
import { BudgetProvider } from "@/context/BugetContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "ExpensiGo",
  icons: {
    icon: "./favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body suppressHydrationWarning>
        <Provider>
          <BudgetProvider>{children}</BudgetProvider>
        </Provider>
      </body>
    </html>
  );
}
