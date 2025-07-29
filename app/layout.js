import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
