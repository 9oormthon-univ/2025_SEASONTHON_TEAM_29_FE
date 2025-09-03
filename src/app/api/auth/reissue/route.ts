// src/app/api/auth/reissue/route.ts
import { NextRequest, NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';

export async function GET(req: NextRequest) {
  const rt = req.cookies.get('refreshToken')?.value;
  if (!rt) {
    return NextResponse.json({ success: false, message: 'Refresh token missing' }, { status: 401 });
  }

  const be = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/member/token-reissue`, {
    method: 'GET',
    headers: { 'X-Refresh-Token': `Bearer ${rt}` },
    cache: 'no-store',
  });
  if (!be.ok) {
    return NextResponse.json({ success: false, message: 'Failed to reissue' }, { status: 401 });
  }

  const authHeader = be.headers.get('authorization');
  const newAT = authHeader?.replace(/^Bearer\s+/i, '') || '';
  const newRT = be.headers.get('x-refresh-token');

  const res = NextResponse.json({ success: true });
  const isProd = process.env.NODE_ENV === 'production';

  if (newAT) {
    res.cookies.set('accessToken', newAT, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
  }
  if (newRT) {
    res.cookies.set('refreshToken', newRT, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
  }
  return res;
}