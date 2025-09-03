// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

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

  // ➜ 쿠키 굽기
  const res = NextResponse.json({ success: true }); // 굳이 AT를 응답 바디로 줄 필요 없음

  const isProd = process.env.NODE_ENV === 'production';

  if (at) {
    res.cookies.set('accessToken', at, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      // maxAge: 백엔드 정책에 맞춰 (예: 15 * 60)
    });
  }
  if (rt) {
    res.cookies.set('refreshToken', rt, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      // maxAge: 예: 14 * 24 * 60 * 60
    });
  }
  return res;
}