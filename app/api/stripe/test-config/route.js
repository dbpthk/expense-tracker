import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = {
      hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasStripePriceId: !!process.env.STRIPE_PRO_PRICE_ID,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      stripeKeyPrefix: process.env.STRIPE_SECRET_KEY
        ? process.env.STRIPE_SECRET_KEY.substring(0, 7)
        : null,
      priceIdPrefix: process.env.STRIPE_PRO_PRICE_ID
        ? process.env.STRIPE_PRO_PRICE_ID.substring(0, 7)
        : null,
    };

    const missingVars = [];
    if (!config.hasStripeSecretKey) missingVars.push("STRIPE_SECRET_KEY");
    if (!config.hasStripePriceId) missingVars.push("STRIPE_PRO_PRICE_ID");
    if (!config.hasAppUrl) missingVars.push("NEXT_PUBLIC_APP_URL");

    const isConfigured = missingVars.length === 0;

    return NextResponse.json({
      success: isConfigured,
      message: isConfigured
        ? "All required environment variables are configured"
        : `Missing required environment variables: ${missingVars.join(", ")}`,
      config,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error testing Stripe config:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test configuration",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
