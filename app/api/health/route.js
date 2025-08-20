import { NextResponse } from "next/server";

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    databaseConfigured: !!process.env.DATABASE_URL,
    features: {
      ai: !!process.env.OPENAI_API_KEY,
      database: !!process.env.DATABASE_URL,
      clerk: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
  };

  return NextResponse.json(health);
}
