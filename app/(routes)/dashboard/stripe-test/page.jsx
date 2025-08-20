"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { CheckCircle, XCircle, AlertCircle, Loader } from "lucide-react";

const StripeTestPage = () => {
  const [configStatus, setConfigStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState({});

  const testConfiguration = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/test-config");
      const data = await response.json();
      setConfigStatus(data);
    } catch (error) {
      setConfigStatus({
        success: false,
        error: "Failed to fetch configuration status",
        details: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const testWebhook = async () => {
    try {
      const response = await fetch("/api/stripe/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          message: "Test webhook from browser",
        }),
      });

      const data = await response.json();
      setTestResults((prev) => ({ ...prev, webhook: data }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        webhook: { error: error.message },
      }));
    }
  };

  const testCheckoutSession = async () => {
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "test-user",
          currency: "aud",
        }),
      });

      const data = await response.json();
      setTestResults((prev) => ({ ...prev, checkout: data }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        checkout: { error: error.message },
      }));
    }
  };

  useEffect(() => {
    testConfiguration();
  }, []);

  const getStatusIcon = (success) => {
    if (success === null)
      return <AlertCircle className="w-5 h-5 text-gray-400" />;
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusColor = (success) => {
    if (success === null) return "text-gray-500";
    return success ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Stripe Configuration Test
          </h1>
          <p className="text-xl text-gray-600">
            Verify your Stripe integration is working correctly
          </p>
        </div>

        {/* Configuration Status */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {getStatusIcon(configStatus?.success)}
              Configuration Status
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Checking configuration...</span>
              </div>
            ) : configStatus ? (
              <div className="space-y-4">
                <div
                  className={`text-lg font-medium ${getStatusColor(
                    configStatus.success
                  )}`}
                >
                  {configStatus.message}
                </div>

                {configStatus.config && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(configStatus.config.hasStripeSecretKey)}
                        <span>Stripe Secret Key</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(configStatus.config.hasStripePriceId)}
                        <span>Stripe Price ID</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(configStatus.config.hasWebhookSecret)}
                        <span>Webhook Secret</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(configStatus.config.hasAppUrl)}
                        <span>App URL</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={testConfiguration} variant="outline">
                  Refresh Configuration
                </Button>
              </div>
            ) : (
              <div className="text-gray-500">
                No configuration data available
              </div>
            )}
          </div>
        </div>

        {/* Test Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Test Webhook</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Test if webhook endpoints are working
              </p>
              <Button onClick={testWebhook} className="w-full">
                Test Webhook
              </Button>
              {testResults.webhook && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(testResults.webhook, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Test Checkout Session</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Test Stripe checkout session creation
              </p>
              <Button onClick={testCheckoutSession} className="w-full">
                Test Checkout
              </Button>
              {testResults.checkout && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(testResults.checkout, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Testing Instructions</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Check Configuration</h3>
              <p className="text-sm text-gray-600">
                Ensure all environment variables are set in your .env.local file
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Test Webhook</h3>
              <p className="text-sm text-gray-600">
                Click "Test Webhook" to verify webhook endpoints are working
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Test Checkout</h3>
              <p className="text-sm text-gray-600">
                Click "Test Checkout" to verify Stripe API integration
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Check Console</h3>
              <p className="text-sm text-gray-600">
                Monitor browser console and server logs for detailed error
                messages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeTestPage;
