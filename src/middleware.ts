// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = new Set([
  '/', '/welcome', '/login', '/auth/login', '/signup', '/auth/signup',
  // 정적/이미지/폰트 등은 자동으로 next() 되도록 별도 처리 가능
]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 공개 경로는 통과
  if (PUBLIC_PATHS.has(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/icons')) {
    return NextResponse.next();
  }

  // 보호 경로: refreshToken 쿠키 없으면 welcome으로
  const rt = req.cookies.get('refreshToken')?.value;
  if (!rt) {
    const url = req.nextUrl.clone();
    url.pathname = '/welcome';
    url.search = ''; // 불필요한 쿼리 제거
    return NextResponse.redirect(url);
  }

  // 쿠키만 있으면 통과 (재발급은 클라에서)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api).*)', // /api 제외 전역
  ],
};