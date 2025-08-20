import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Helper function to update user subscription status
const updateUserSubscription = async (userId, stripeSubscription) => {
  try {
    // This would typically update a database
    // For now, we'll just log the update
    console.log(`Updating subscription for user ${userId}:`, {
      status: stripeSubscription.status,
      subscriptionId: stripeSubscription.id,
      customerId: stripeSubscription.customer,
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    });

    // In a real app, you would:
    // 1. Update user subscription in your database
    // 2. Send confirmation emails
    // 3. Update user permissions
    // 4. Log the subscription change
  } catch (error) {
    console.error("Error updating user subscription:", error);
  }
};

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature");

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("Checkout session completed:", session.id);

        // Update user subscription status
        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription
          );
          await updateUserSubscription(session.metadata.userId, subscription);
        }
        break;

      case "customer.subscription.created":
        const subscriptionCreated = event.data.object;
        console.log("Subscription created:", subscriptionCreated.id);
        await updateUserSubscription(
          subscriptionCreated.metadata.userId,
          subscriptionCreated
        );
        break;

      case "customer.subscription.updated":
        const subscriptionUpdated = event.data.object;
        console.log("Subscription updated:", subscriptionUpdated.id);
        await updateUserSubscription(
          subscriptionUpdated.metadata.userId,
          subscriptionUpdated
        );
        break;

      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object;
        console.log("Subscription deleted:", subscriptionDeleted.id);
        await updateUserSubscription(
          subscriptionDeleted.metadata.userId,
          subscriptionDeleted
        );
        break;

      case "invoice.payment_succeeded":
        const invoiceSucceeded = event.data.object;
        console.log("Invoice payment succeeded:", invoiceSucceeded.id);
        // Handle successful payment
        break;

      case "invoice.payment_failed":
        const invoiceFailed = event.data.object;
        console.log("Invoice payment failed:", invoiceFailed.id);
        // Handle failed payment
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
