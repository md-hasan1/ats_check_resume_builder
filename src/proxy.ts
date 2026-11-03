import { betterFetch } from "@better-fetch/fetch";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/ats-checker",
  "/history",
  "/profile",
  "/upload",
  "/analysis",
  "/reports",
  "/settings",
  "/billing",
  "/admin",
  "/jobs",
  "/candidates",
  "/pipeline",
  "/interviews",
  "/team",
  "/my-resumes",
  "/cv-builder",
  "/cover-letter",
  "/interview-prep",
  "/linkedin-analyzer",
];

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the path is a protected route
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!isProtected && !isAuthRoute) {
    return NextResponse.next();
  }

  // Check session
  const { data: session } = await betterFetch<Record<string, unknown>>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  // If not authenticated and trying to access any protected route
  if (!session && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access auth routes, redirect to dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ats-checker/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/upload/:path*",
    "/analysis/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/admin/:path*",
    "/jobs/:path*",
    "/candidates/:path*",
    "/pipeline/:path*",
    "/interviews/:path*",
    "/team/:path*",
    "/my-resumes/:path*",
    "/cv-builder/:path*",
    "/cover-letter/:path*",
    "/interview-prep/:path*",
    "/linkedin-analyzer/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};

