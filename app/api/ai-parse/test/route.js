import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "AI Parse API is working!",
    timestamp: new Date().toISOString(),
    status: "healthy",
  });
}
