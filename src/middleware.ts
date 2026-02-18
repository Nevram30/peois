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
          new URL("/super-admin/dashboard", req.url),
        );
      } else if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } else if (role === "ADMIN_ASSISTANT") {
        return NextResponse.redirect(
          new URL("/admin-assistant/dashboard", req.url),
        );
      } else if (role === "DIVISION_CLERK") {
        return NextResponse.redirect(
          new URL("/division-clerk/dashboard", req.url),
        );
      } else if (role === "DIVISION_HEAD") {
        return NextResponse.redirect(
          new URL("/division-head/dashboard", req.url),
        );
      } else if (role === "SECTION_HEAD") {
        return NextResponse.redirect(
          new URL("/section-head/dashboard", req.url),
        );
      } else if (role === "PROVINCIAL_ENGR") {
        return NextResponse.redirect(
          new URL("/provincial-engr/dashboard", req.url),
        );
      }
    }
    return NextResponse.next();
  }

  // Protect role-based dashboard routes
  const roleRoutes: Record<string, string> = {
    "/super-admin/": "SUPER_ADMIN",
    "/admin-assistant/": "ADMIN_ASSISTANT",
    "/division-clerk/": "DIVISION_CLERK",
    "/division-head/": "DIVISION_HEAD",
    "/section-head/": "SECTION_HEAD",
    "/provincial-engr/": "PROVINCIAL_ENGR",
  };

  // Check specific role routes first (before admin, to avoid prefix conflicts)
  for (const [routePrefix, requiredRole] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(routePrefix)) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      const role = token.user?.role as string | undefined;
      if (role !== requiredRole) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }
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
    "/admin-assistant/:path*",
    "/division-clerk/:path*",
    "/division-head/:path*",
    "/section-head/:path*",
    "/provincial-engr/:path*",
  ],
};
