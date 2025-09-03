import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL!;
const isProd = process.env.NODE_ENV === 'production';
const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined; // 필요 시 ".wedit.me" 등

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // (옵션) CSRF 검증용

    if (!code) return NextResponse.redirect(new URL('/login?e=no_code', req.url));

    // (옵션) state 검증: 세션/서버 저장한 nonce와 대조
    // if (!(await verifyState(state))) return NextResponse.redirect(new URL('/login?e=bad_state', req.url));

    const be = await fetch(
      `${API}/v1/member/oauth-login?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state ?? '')}`,
      { method: 'GET', cache: 'no-store' }
    );
    if (!be.ok) return NextResponse.redirect(new URL('/login?e=exchange_fail', req.url));

    const json = await be.json().catch(() => ({}));
    // 백엔드가 헤더로 토큰을 줄 수도 있으니 보조 파싱
    const at = json?.data?.accessToken || be.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const rt = json?.data?.refreshToken || be.headers.get('x-refresh-token');

    // (선택) 신규 가입 분기 지원
    const isNew = Boolean(json?.data?.isNewUser);
    const redirectTo = isNew ? '/signup/social' : '/home';

    const res = NextResponse.redirect(new URL(redirectTo, req.url));

    if (at) {
      res.cookies.set('accessToken', at, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        domain: COOKIE_DOMAIN,     // 서브도메인 공유 필요 시 지정
        // maxAge: 60 * 15,        // 백엔드 정책에 맞춰 설정 권장(예: 15분)
      });
    }
    if (rt) {
      res.cookies.set('refreshToken', rt, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        domain: COOKIE_DOMAIN,
        // maxAge: 60 * 60 * 24 * 14, // 예: 14일
      });
    }

    return res;
  } catch {
    // 실패 시 쿠키 제거 + 로그인으로
    const res = NextResponse.redirect(new URL('/login?e=callback_error', req.url));
    res.cookies.set('accessToken', '', { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', expires: new Date(0) });
    res.cookies.set('refreshToken', '', { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', expires: new Date(0) });
    return res;
  }
}