import { NextResponse } from "next/server";

/**
 * Test Webhook Endpoint
 * Use this to verify your webhook configuration is working
 *
 * Test with: curl -X POST http://localhost:3000/api/stripe/test-webhook
 */

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("🧪 Test Webhook Received:", {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      body: body,
      headers: Object.fromEntries(request.headers.entries()),
    });

    return NextResponse.json({
      success: true,
      message: "Test webhook received successfully",
      timestamp: new Date().toISOString(),
      receivedData: body,
    });
  } catch (error) {
    console.error("❌ Test Webhook Error:", error);
    return NextResponse.json(
      {
        error: "Test webhook failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return NextResponse.json({
    message: "Test webhook endpoint is working",
    timestamp: new Date().toISOString(),
    instructions: "Send a POST request to test webhook functionality",
  });
}
