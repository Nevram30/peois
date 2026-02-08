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
          new URL("/dashboard/super-admin", req.url),
        );
      } else if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      } else if (role === "ADMIN_ASSISTANT") {
        return NextResponse.redirect(
          new URL("/dashboard/admin-assistant", req.url),
        );
      }
    }
    return NextResponse.next();
  }

  // Protect all dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.user?.role as string | undefined;

    // Role-based route access
    if (
      pathname.startsWith("/dashboard/super-admin") &&
      role !== "SUPER_ADMIN"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (
      pathname.startsWith("/dashboard/admin-assistant") &&
      role !== "ADMIN_ASSISTANT"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (
      pathname === "/dashboard/admin" ||
      pathname.startsWith("/dashboard/admin/")
    ) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
