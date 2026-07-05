import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { edgeAuthConfig } from "~/server/auth/edge-config";

const { auth } = NextAuth(edgeAuthConfig);

export default auth((req) => {
  const token = req.auth;
  const { pathname } = req.nextUrl;

  // Redirect root to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow access to login page only if NOT authenticated
  if (pathname === "/login") {
    if (token) {
      const role = token.user?.role as string | undefined;
      if (role === "SUPER_ADMIN") {
        return NextResponse.redirect(
          new URL("/super-admin/dashboardv2", req.url),
        );
      } else if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } else if (role === "USER") {
        return NextResponse.redirect(new URL("/user/dashboard", req.url));
      }
    }
    return NextResponse.next();
  }

  // Protect role-based dashboard routes
  if (pathname.startsWith("/super-admin/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const role = token.user?.role as string | undefined;
    if (role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/user/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const role = token.user?.role as string | undefined;
    if (role !== "USER") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Admin routes (check after more specific routes)
  if (
    pathname === "/admin/dashboard" ||
    pathname.startsWith("/admin/dashboard/")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const role = token.user?.role as string | undefined;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/login",
    "/super-admin/:path*",
    "/admin/:path*",
    "/user/:path*",
  ],
};
