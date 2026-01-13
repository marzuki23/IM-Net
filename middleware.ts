import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("imnet-session");
  const role = request.cookies.get("imnet-role")?.value;
  const { pathname } = request.nextUrl;

  // Debug logs
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    console.log(`Middleware - Path: ${pathname}, Role: ${role}, Session: ${!!session}`);
  }

  // Protect /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    // Redirect admin to /admin if they try to access /dashboard
    if (role === "admin") {
      console.log("Middleware - Redirecting Admin to /admin");
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Protect /admin
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    // Strict Role Check for Admin
    if (role !== "admin") {
       console.log(`Middleware - Access denied to /admin for role: ${role}. Redirecting to /dashboard`);
       return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect to dashboard/admin if already logged in
  if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup")) {
    if (session) {
       const target = role === "admin" ? "/admin" : "/dashboard";
       return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*"],
};
