// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = new Set([
  '/', '/login', '/auth/login', '/signup', '/auth/signup',
  // 정적/이미지/폰트 등은 자동으로 next() 되도록 별도 처리 가능
]);

function isStaticAsset(pathname: string) {
  // 확장자 있는 정적 파일은 모두 통과 (png, jpg, svg, css, js, woff2, json 등)
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;

  // Next 내부 자산
  if (pathname.startsWith('/_next')) return true;

  // 널리 쓰는 정적 디렉토리들
  if (
    pathname.startsWith('/icons') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/splash') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/static')
  ) return true;

  // PWA 필수 파일들(루트에 존재)
  if (
    pathname === '/sw.js' ||
    pathname === '/manifest.json' ||
    pathname === '/robots.txt' ||
    pathname === '/apple-touch-icon.png'
  ) return true;

  return false;
}


export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 공개 경로/정적/PWA 파일은 통과
  if (PUBLIC_PATHS.has(pathname) || isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // 보호 경로: refreshToken 쿠키 없으면 웰컴으로
  const rt = req.cookies.get('refreshToken')?.value;
  if (!rt) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // 쿠키만 있으면 통과 (AT 재발급은 클라에서)
  return NextResponse.next();
}

export const config = {
  // /api 제외, 나머지 전역
  matcher: ['/((?!api).*)'],
};