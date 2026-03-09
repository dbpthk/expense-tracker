import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description: "ExpensiGo terms of service - terms and conditions for using our app.",
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: March 2025</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Acceptance</h2>
            <p className="text-gray-600">
              By using ExpensiGo, you agree to these terms. If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Service Description</h2>
            <p className="text-gray-600">
              ExpensiGo provides expense tracking and budget management tools. We reserve the right to modify, suspend, or discontinue features with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Account & Eligibility</h2>
            <p className="text-gray-600">
              You must be 18+ and provide accurate information. You are responsible for maintaining account security. Notify us of any unauthorised access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Acceptable Use</h2>
            <p className="text-gray-600">
              Use the service lawfully. Do not abuse, reverse-engineer, or attempt to access other users&apos; data. We may suspend accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Subscriptions & Payments</h2>
            <p className="text-gray-600">
              Paid plans are billed via Stripe. Fees are non-refundable unless required by law. Cancel anytime; access continues until the end of the billing period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Disclaimers</h2>
            <p className="text-gray-600">
              The service is provided &quot;as is&quot;. We do not guarantee accuracy of financial insights or uninterrupted availability. Use at your own risk for financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Limitation of Liability</h2>
            <p className="text-gray-600">
              To the extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Contact</h2>
            <p className="text-gray-600">
              For terms inquiries: <a href="mailto:dpthk2024@gmail.com" className="text-blue-600 hover:underline">dpthk2024@gmail.com</a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
