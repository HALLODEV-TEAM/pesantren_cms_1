import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "pesantren-al-ikhlas-cms-super-secret-key-2026",
);

const COOKIE_NAME = "pesantren_admin_token";

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return !!payload?.username;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const isLoginRoute = pathname === "/admin/login";
    const loggedIn = await isAuthenticated(request);

    // If user is already logged in and attempts to access /admin/login -> redirect to /admin
    if (isLoginRoute) {
      if (loggedIn) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // If user is NOT logged in and tries to access /admin or /admin/* -> redirect to /admin/login
    if (!loggedIn) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
