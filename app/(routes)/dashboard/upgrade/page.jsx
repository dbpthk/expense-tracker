"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Star,
  Zap,
  Shield,
  BarChart3,
  Users,
  Crown,
  Mail,
  Download,
  Receipt,
  Bell,
  Palette,
  Camera,
  TrendingDown,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useSubscription } from "@/context/SubscriptionContext";
import { toast } from "sonner";

const UpgradePage = () => {
  const { user } = useUser();
  const { subscription, upgradeToPro, downgradeToFree, openBillingPortal } =
    useSubscription();

  // Handle Stripe checkout success/cancel messages
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const canceled = urlParams.get("canceled");
    const sessionId = urlParams.get("session_id");

    if (success && sessionId) {
      toast.success("Payment successful!", {
        description:
          "Welcome to ExpensiGo Pro! Your subscription is now active.",
      });
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled) {
      toast.info("Payment canceled", {
        description: "You can try upgrading again anytime.",
      });
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description:
        "Get intelligent spending recommendations and financial insights powered by advanced AI algorithms.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description:
        "Deep dive into your spending patterns with detailed charts, trends, and predictive analysis.",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Data Export & Backup",
      description:
        "Export your data to CSV, Excel, and PDF formats for record keeping and analysis.",
    },
    {
      icon: <Receipt className="w-6 h-6" />,
      title: "Receipt Upload",
      description:
        "Upload and store receipts for better expense tracking and documentation.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Smart Reminders",
      description:
        "Get daily/weekly reminders to log expenses and stay on top of your budget.",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Custom Themes",
      description:
        "Personalize your dashboard with custom themes and color schemes.",
    },
  ];

  const plans = [
    {
      name: "Free",
      price: "AUD $0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Up to 5 budgets",
        "Up to 50 expenses/month",
        "Basic categories only",
        "Basic expense tracking",
        "Simple charts",
        "Text-only expenses",
        "Limited themes",
        "Basic budget alerts",
        "Email support",
      ],
      popular: false,
      buttonText:
        subscription.status === "free" ? "Current Plan" : "Downgrade to Free",
      buttonVariant: "outline",
      disabled: subscription.status === "free",
    },
    {
      name: "Pro",
      price: "AUD $2.99",
      period: "per month",
      description: "Best for individuals and small families",
      features: [
        "Unlimited budgets & expenses",
        "Advanced expense tracking",
        "Export to CSV/Excel/PDF",
        "AI-powered insights",
        "Advanced analytics",
        "Smart reminders (daily/weekly)",
        "Upload receipts/images",
        "Custom dashboards",
        "Emoji/icon for budgets",
        "Custom themes",
        "Priority support",
        "Mobile app access",
      ],
      popular: true,
      buttonText:
        subscription.status === "pro" ? "Current Plan" : "Upgrade to Pro",
      buttonVariant: "default",
      disabled: subscription.status === "pro",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For teams and businesses",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Multi-user accounts",
        "Custom integrations",
        "Advanced reporting",
        "API access",
        "White-label options",
        "Custom branding",
        "Dedicated support",
        "SLA guarantees",
        "Custom training",
        "On-premise deployment",
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      disabled: false,
    },
  ];

  const handleUpgrade = async (plan) => {
    if (plan.name === "Pro" && subscription.status !== "pro") {
      try {
        await upgradeToPro();
        toast.success("Redirecting to checkout...", {
          description:
            "You'll be redirected to Stripe to complete your upgrade.",
        });
      } catch (error) {
        toast.error("Upgrade failed", {
          description: "Please try again or contact support.",
        });
      }
    } else if (plan.name === "Enterprise") {
      toast.success("Enterprise Contact", {
        description: "Our sales team will contact you within 24 hours.",
      });
    }
  };

  const handleDowngrade = async () => {
    try {
      await downgradeToFree();
      toast.success("Successfully downgraded to Free plan");
    } catch (error) {
      toast.error("Downgrade failed", {
        description: "Please try again or contact support.",
      });
    }
  };

  const handleBillingPortal = async () => {
    try {
      await openBillingPortal();
    } catch (error) {
      toast.error("Failed to open billing portal", {
        description: "Please try again or contact support.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Upgrade Your Experience
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock the full potential of your financial management with
              premium features, AI-powered insights, and advanced analytics
              designed for professionals.
            </p>
            {subscription.status === "trial" && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                🎉 You're currently on a free trial - upgrade to keep unlimited
                access!
              </div>
            )}

            {/* Development Test Button - Remove in production */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4">
                <Button
                  onClick={() => {
                    console.log("Current subscription:", subscription);
                    console.log("Environment check:", {
                      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
                      hasPriceId: !!process.env.STRIPE_PRO_PRICE_ID,
                      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
                    });
                  }}
                  variant="outline"
                  size="sm"
                >
                  Debug: Check Config
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Beta Testing Notice */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="text-xl">🚀</span>
          <p className="text-base font-medium">
            The app is in beta testing so the pro features are available for
            free users as well!
          </p>
          <span className="text-xl">🎉</span>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Premium?
          </h2>
          <p className="text-lg text-gray-600">
            Experience the difference with enterprise-grade features and
            insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600">
            Start free and upgrade when you're ready for more power
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full py-3 text-lg font-medium cursor-pointer ${
                  plan.popular
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    : ""
                }`}
                variant={plan.buttonVariant}
                disabled={plan.disabled}
                onClick={() => handleUpgrade(plan)}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Current Subscription Management */}
      {subscription.status !== "free" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Manage Your Subscription
              </h2>
              <p className="text-lg text-gray-600">
                You're currently on the{" "}
                {subscription.status === "pro" ? "Pro" : "Trial"} plan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Billing Portal */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Billing & Invoices
                    </h3>
                    <p className="text-sm text-gray-600">
                      View invoices, update payment methods
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleBillingPortal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Open Billing Portal
                </Button>
              </div>

              {/* Downgrade */}
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Downgrade to Free
                    </h3>
                    <p className="text-sm text-gray-600">
                      Cancel your Pro subscription
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleDowngrade}
                  variant="outline"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Downgrade to Free
                </Button>
              </div>
            </div>

            {/* Current Plan Details */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">
                Current Plan Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Plan:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {subscription.status === "pro" ? "Pro Plan" : "Free Trial"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Budget Limit:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {subscription.budgetLimit === 999
                      ? "Unlimited"
                      : subscription.budgetLimit}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Expense Limit:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {subscription.expenseLimit === 99999
                      ? "Unlimited"
                      : subscription.expenseLimit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our team is here to help you get the most out of ExpenseTracker
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Support */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    General Support
                  </h3>
                  <p className="text-gray-600">Get help with your account</p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("dpthk2024@gmail.com");
                  toast.success("Email copied to clipboard!");
                }}
                className="text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors cursor-pointer"
              >
                dpthk2024@gmail.com
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Click to copy email address
              </p>
            </div>

            {/* Enterprise Sales */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Enterprise Sales
                  </h3>
                  <p className="text-gray-600">Contact our sales team</p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("dpthk2024@gmail.com");
                  toast.success(
                    "Enterprise contact email copied to clipboard!"
                  );
                }}
                className="text-purple-600 hover:text-purple-700 font-medium text-lg transition-colors cursor-pointer"
              >
                dpthk2024@gmail.com
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Click to copy email address
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
