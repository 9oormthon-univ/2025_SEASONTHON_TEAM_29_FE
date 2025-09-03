// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/member/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!backendRes.ok) {
    const msg = await backendRes.text().catch(() => '로그인 실패');
    return NextResponse.json({ success: false, message: msg }, { status: 401 });
  }

  const data = await backendRes.json();
  const at = data?.data?.accessToken;
  const rt = data?.data?.refreshToken;

  const res = NextResponse.json({ success: true, accessToken: at });

  if (at) {
    res.cookies.set('accessToken', at, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
  }
  if (rt) {
    res.cookies.set('refreshToken', rt, {
      httpOnly: true,
      secure: isProd,     // 로컬에서는 false
      sameSite: 'lax',
      path: '/',
    });
  }

  return res;
}