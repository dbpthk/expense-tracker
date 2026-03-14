import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/demo-login",
  "/features",
  "/about",
  "/privacy",
  "/terms",
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/sign-in") && url.searchParams.get("demo") === "user") {
    const apiUrl = new URL("/api/demo-login", url.origin);
    return NextResponse.redirect(apiUrl);
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
