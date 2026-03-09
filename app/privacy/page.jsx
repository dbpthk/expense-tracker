import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "ExpensiGo privacy policy - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">ExpensiGo</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: March 2025</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Data We Collect</h2>
            <p className="text-gray-600">
              We collect account information (email, name), financial data you enter (budgets, expenses), and usage data (login activity, feature usage). Authentication is handled by Clerk; payment processing by Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. How We Use Your Data</h2>
            <p className="text-gray-600">
              Your data is used to provide the service (budget tracking, analytics), improve the app, process payments, and communicate with you. We do not sell your personal or financial data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Data Storage & Security</h2>
            <p className="text-gray-600">
              Data is stored in PostgreSQL (Neon) with encryption at rest. We use industry-standard security practices. Access is restricted to authenticated users only; each user&apos;s data is isolated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Cookies & Tracking</h2>
            <p className="text-gray-600">
              We use essential cookies for authentication (Clerk) and session management. Analytics may use anonymised usage data. You can manage cookie preferences in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Third-Party Services</h2>
            <p className="text-gray-600">
              We use Clerk (auth), Stripe (payments), Vercel (hosting), and Neon (database). Each has its own privacy policy. We share only the data necessary for their services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Your Rights</h2>
            <p className="text-gray-600">
              You may access, correct, or delete your data via the app settings. Export your data via CSV. Contact us to request data portability or deletion. We retain data as required by law or for legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Contact</h2>
            <p className="text-gray-600">
              For privacy inquiries: <a href="mailto:dpthk2024@gmail.com" className="text-blue-600 hover:underline">dpthk2024@gmail.com</a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
