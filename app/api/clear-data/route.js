// app/api/settings/clear-data/route.js
import db from "@/lib/db";
import { Expenses, Budgets } from "@/utils/schema";

export async function POST(req) {
  const { userId } = await req.json();
  if (!userId) return new Response("Missing userId", { status: 400 });

  await db.delete(Expenses).where({ createdBy: userId });
  await db.delete(Budgets).where({ createdBy: userId });

  return new Response(JSON.stringify({ success: true }));
}
