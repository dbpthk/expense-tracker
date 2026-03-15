import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { resetDemoData } from "@/lib/resetDemoData";

function verifyCronAuth(request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  return expected && authHeader === `Bearer ${expected}`;
}

/**
 * GET /api/reset-demo
 * Called by Vercel cron every 30 minutes. Requires CRON_SECRET in Authorization header.
 */
export async function GET(request) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runReset();
}

/**
 * POST /api/reset-demo
 * Manual reset by demo user (publicMetadata.demo === true).
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await currentUser();
  if (user?.publicMetadata?.demo !== true) {
    return NextResponse.json(
      { error: "Only demo users can reset demo data" },
      { status: 403 }
    );
  }
  return runReset();
}

async function runReset() {
  try {
    const result = await resetDemoData();
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Reset failed" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      budgetsCreated: result.budgetsCreated,
      expensesCreated: result.expensesCreated,
    });
  } catch (error) {
    console.error("Reset demo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
