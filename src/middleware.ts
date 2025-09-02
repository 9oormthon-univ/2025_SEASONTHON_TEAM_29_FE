import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/auth/login",
  "/signup",
  "/auth/signup",
]);

function isStaticAsset(pathname: string) {
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;
  if (pathname.startsWith("/_next")) return true;
  if (
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/splash") ||
    pathname.startsWith("/splash_screens") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/static")
  )
    return true;

  if (
    pathname === "/sw.js" ||
    pathname === "/manifest.json" ||
    pathname === "/robots.txt" ||
    pathname === "/apple-touch-icon.png"
  )
    return true;

  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 공개/정적 경로는 통과
  if (PUBLIC_PATHS.has(pathname) || isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // 보호 경로: accessToken 없으면 /로
  const at = req.cookies.get("accessToken")?.value;
  if (!at) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"],
};