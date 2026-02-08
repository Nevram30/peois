import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  // Redirect root to login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow access to login page only if NOT authenticated
  if (pathname === "/login") {
    if (token) {
      const role = token.role as string;
      if (role === "SUPER_ADMIN") {
        return NextResponse.redirect(
          new URL("/dashboard/super-admin", request.url),
        );
      } else if (role === "ADMIN") {
        return NextResponse.redirect(
          new URL("/dashboard/admin", request.url),
        );
      } else if (role === "ADMIN_ASSISTANT") {
        return NextResponse.redirect(
          new URL("/dashboard/admin-assistant", request.url),
        );
      }
    }
    return NextResponse.next();
  }

  // Protect all dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = token.role as string;

    // Role-based route access
    if (pathname.startsWith("/dashboard/super-admin") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/dashboard/admin-assistant") && role !== "ADMIN_ASSISTANT") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (
      pathname === "/dashboard/admin" ||
      pathname.startsWith("/dashboard/admin/")
    ) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
