import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL!; // ex) https://wedit.me/api

async function forward(req: NextRequest, path: string) {
  const url = `${API}/v1/${path}`;
  const at = req.cookies.get('accessToken')?.value ?? '';
  const headers = new Headers(req.headers);
  headers.set('host', new URL(API).host);
  if (at) headers.set('authorization', `Bearer ${at}`);
  headers.delete('cookie');

  const init: RequestInit = {
    method: req.method,
    headers,
    body: ['GET','HEAD'].includes(req.method) ? undefined : await req.text(),
    cache: 'no-store',
    redirect: 'manual',
  };
  return fetch(url, init);
}

async function tryReissue(origin: URL) {
  const res = await fetch(new URL('/api/auth/reissue', origin).toString(), { cache: 'no-store' });
  return res.ok;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params; // ✅ 변경 포인트
  let res = await forward(req, path.join('/'));

  if (res.status === 401) {
    const ok = await tryReissue(new URL(req.url));
    if (ok) res = await forward(req, path.join('/'));
  }

  return new NextResponse(res.body, { status: res.status, headers: res.headers });
}

export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;