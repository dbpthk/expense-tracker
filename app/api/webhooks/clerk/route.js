import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(request) {
  const demoEmail = process.env.DEMO_USER_EMAIL;
  const demoPassword = process.env.DEMO_USER_PASSWORD;

  if (!demoEmail || !demoPassword) {
    return NextResponse.json(
      { error: "Demo config not set" },
      { status: 500 }
    );
  }

  try {
    const evt = await verifyWebhook(request);

    if (evt.type !== "user.updated") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const user = evt.data;
    const primaryEmailId = user.primary_email_address_id;
    const emailObj = user.email_addresses?.find(
      (e) => e.id === primaryEmailId
    );
    const email = emailObj?.email_address;

    if (email !== demoEmail) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const client = await clerkClient();
    await client.users.updateUser(user.id, {
      password: demoPassword,
      signOutOfOtherSessions: true,
    });

    return NextResponse.json({ received: true, demoPasswordReset: true }, { status: 200 });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
