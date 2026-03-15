import { NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(request) {
  try {
    await verifyWebhook(request);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
