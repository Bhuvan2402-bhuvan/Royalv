import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "royalv_session";
const SECRET_KEY = process.env.AUTH_SECRET || "royalv_development_super_secret_session_key_replace_in_production_min_32_chars";
const encodedSecret = new TextEncoder().encode(SECRET_KEY);

const ADMIN_PREFIX = "/admin";
const DASHBOARD_PREFIX = "/dashboard";
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let session: { userId: string; email: string; role: string; name: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, encodedSecret, { algorithms: ["HS256"] });
      session = payload as unknown as { userId: string; email: string; role: string; name: string };
    } catch {
      session = null;
    }
  }

  // 1. If accessing auth routes (login/signup) while already authenticated, redirect appropriately
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route)) && session) {
    const isStaffOrAdmin = ["ADMIN", "SUPER_ADMIN", "PROPERTY_MANAGER", "FIELD_AGENT", "AGENT"].includes(session.role);
    const destination = isStaffOrAdmin ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 2. Protect Admin routes (/admin/*)
  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isStaffOrAdmin = ["ADMIN", "SUPER_ADMIN", "PROPERTY_MANAGER", "FIELD_AGENT", "AGENT"].includes(session.role);
    if (!isStaffOrAdmin) {
      // Forbidden: Customers cannot access admin routes
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 3. Protect Customer Dashboard routes (/dashboard/*)
  if (pathname.startsWith(DASHBOARD_PREFIX)) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Set standard security headers on response
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
