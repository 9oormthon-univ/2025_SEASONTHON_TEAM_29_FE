// middleware.ts (선택사항: 아예 삭제해도 됨)
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC = new Set(['/', '/login', '/signup', '/auth/callback', '/social', '/coming-soon']);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 정적/공개 경로만 통과 – 보호는 클라이언트 AuthGate로.
  if (PUBLIC.has(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/icons') || pathname.startsWith('/images') || pathname.startsWith('/static') || pathname === '/sw.js' || pathname === '/manifest.json') {
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!api).*)'] };