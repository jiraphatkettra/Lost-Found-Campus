import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/items/new") ||
    pathname.includes("/edit") ||
    pathname.startsWith("/my-items") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/admin");

  if (isProtected) {
    // ตรวจสอบ session token cookie จาก Auth.js (รองรับทั้ง http และ https/secure)
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      const fullPath = `${pathname}${search}`;
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", fullPath);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/items/new",
    "/items/:id/edit",
    "/my-items",
    "/my-items/:path*",
    "/notifications",
    "/notifications/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
