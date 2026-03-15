import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { resetDemoData } from "@/lib/resetDemoData";

export async function GET(request) {
  try {
    const demoEmail = process.env.DEMO_USER_EMAIL;
    const demoPassword = process.env.DEMO_USER_PASSWORD;

    if (!demoEmail || !demoPassword) {
      console.error(
        "Demo login: DEMO_USER_EMAIL or DEMO_USER_PASSWORD not set",
      );
      return NextResponse.redirect(
        new URL("/sign-in?error=demo_unavailable", request.url),
      );
    }

    const client = await clerkClient();

    const { data: users } = await client.users.getUserList({
      emailAddress: [demoEmail],
    });

    if (!users || users.length === 0) {
      return NextResponse.redirect(
        new URL("/sign-in?error=demo_unavailable", request.url),
      );
    }

    const demoUser = users[0];

    const { verified } = await client.users.verifyPassword({
      userId: demoUser.id,
      password: demoPassword,
    });

    if (!verified) {
      return NextResponse.redirect(
        new URL("/sign-in?error=demo_unavailable", request.url),
      );
    }

    const { token } = await client.signInTokens.createSignInToken({
      userId: demoUser.id,
      expiresInSeconds: 300,
    });

    // Reset demo data so recruiters always see fresh seed state
    await resetDemoData();

    const url = new URL("/sign-in", request.url);
    url.searchParams.set("__clerk_ticket", token);

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.redirect(
      new URL("/sign-in?error=demo_unavailable", request.url),
    );
  }
}
