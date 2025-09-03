// src/app/api/auth/social-signup/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL!;
const isProd = process.env.NODE_ENV === 'production';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const socialToken = req.cookies.get('socialToken')?.value ?? '';
  const oauthCode   = req.cookies.get('oauthCode')?.value ?? '';
  const oauthState  = req.cookies.get('oauthState')?.value ?? '';

  // 백엔드 규격에 맞게 헤더/쿼리/바디 조합
  const be = await fetch(`${API}/v1/member/oauth-signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(socialToken ? { 'X-Social-Token': `Bearer ${socialToken}` } : {}),
      ...(oauthCode ? { 'X-OAuth-Code': oauthCode, 'X-OAuth-State': oauthState } : {}),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!be.ok) {
    return new NextResponse(await be.text(), { status: be.status });
  }

  // 가입 완료 시 토큰 내려줌 → 쿠키 세팅
  const json = await be.json().catch(() => ({}));
  const at = json?.data?.accessToken;
  const rt = json?.data?.refreshToken;

  const res = NextResponse.json({ success: true });
  if (at) res.cookies.set('accessToken', at, { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/' });
  if (rt) res.cookies.set('refreshToken', rt, { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/' });

  // 일회성 쿠키 정리
  res.cookies.set('socialToken', '', { path: '/', maxAge: 0 });
  res.cookies.set('oauthCode',   '', { path: '/', maxAge: 0 });
  res.cookies.set('oauthState',  '', { path: '/', maxAge: 0 });

  return res;
}