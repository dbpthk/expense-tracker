#!/usr/bin/env node

/**
 * Stripe Configuration Test Script
 * Run this to verify your Stripe setup is working
 */

require("dotenv").config({ path: ".env.local" });

const Stripe = require("stripe");

async function testStripeConfig() {
  console.log("🔍 Testing Stripe Configuration...\n");

  // Check environment variables
  const requiredVars = [
    "STRIPE_SECRET_KEY",
    "STRIPE_PRO_PRICE_ID",
    "NEXT_PUBLIC_APP_URL",
  ];

  console.log("📋 Environment Variables Check:");
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${varName}: MISSING`);
    }
  }

  // Test Stripe connection
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log(
      "\n❌ STRIPE_SECRET_KEY not found. Cannot test Stripe connection."
    );
    return;
  }

  try {
    console.log("\n🔌 Testing Stripe Connection...");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    // Test API connection
    const account = await stripe.accounts.retrieve();
    console.log(
      `✅ Stripe Connection: SUCCESS (Mode: ${
        account.object === "account" ? "Live" : "Test"
      })`
    );

    // Test Price ID
    if (process.env.STRIPE_PRO_PRICE_ID) {
      try {
        const price = await stripe.prices.retrieve(
          process.env.STRIPE_PRO_PRICE_ID
        );
        console.log(
          `✅ Price ID Valid: ${price.nickname || "No nickname"} - ${
            price.unit_amount / 100
          } ${price.currency.toUpperCase()}`
        );

        if (price.active) {
          console.log(`✅ Price Status: Active`);
        } else {
          console.log(`⚠️  Price Status: Inactive (Archived)`);
        }
      } catch (error) {
        console.log(`❌ Price ID Invalid: ${error.message}`);
      }
    }

    // Test Webhook Secret
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      console.log(`✅ Webhook Secret: Configured`);
    } else {
      console.log(`⚠️  Webhook Secret: Not configured (webhooks won't work)`);
    }
  } catch (error) {
    console.log(`❌ Stripe Connection Failed: ${error.message}`);

    if (error.type === "StripeAuthenticationError") {
      console.log("💡 This usually means your STRIPE_SECRET_KEY is invalid");
    } else if (error.type === "StripeInvalidRequestError") {
      console.log("💡 This usually means your API version is outdated");
    }
  }

  console.log("\n🎯 Next Steps:");
  console.log("1. Ensure all environment variables are set in .env.local");
  console.log("2. Restart your development server");
  console.log("3. Test the upgrade flow in your app");
  console.log("4. Check browser console and server logs for errors");
}

// Run the test
testStripeConfig().catch(console.error);
