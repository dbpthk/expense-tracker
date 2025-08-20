import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not configured");
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    const { priceId } = await request.json();

    // Use provided priceId or fallback to environment variable
    const finalPriceId = priceId || process.env.STRIPE_PRO_PRICE_ID;

    if (!finalPriceId) {
      console.error(
        "No price ID provided and STRIPE_PRO_PRICE_ID not configured"
      );
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    console.log(
      `Creating checkout session for user ${userId} with price ${finalPriceId}`
    );

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade?canceled=true`,
      customer_email: userId, // You might want to get the actual email from Clerk
      metadata: {
        userId: userId,
      },
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
      // Add billing address collection for better customer experience
      billing_address_collection: "auto",
      // Allow promotion codes
      allow_promotion_codes: true,
    });

    console.log(`Checkout session created successfully: ${session.id}`);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);

    // Provide more specific error messages
    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { error: "Invalid Stripe configuration. Please check your price ID." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    );
  }
}
