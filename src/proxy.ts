import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = process.env.COOKIE_NAME ?? "sosbairro_token";

const PROTECTED_PREFIXES = ["/dashboard", "/occurrences", "/users", "/perfil"];

const GUEST_ONLY_PREFIXES = ["/login", "/register"];

export function proxy(req: NextRequest) {
  console.log("[MW] hit:", req.nextUrl.pathname);
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(COOKIE_NAME)?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isGuestOnly = GUEST_ONLY_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isGuestOnly && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/occurrences/:path*",
    "/users/:path*",
    "/perfil/:path*",
    "/login",
    "/register",
  ],
};
