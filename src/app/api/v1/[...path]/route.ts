// src/app/api/v1/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL!; // e.g. https://wedit.me/api

async function forward(req: NextRequest, path: string) {
  const url = `${API}/v1/${path}`;
  const at = req.cookies.get('accessToken')?.value ?? '';

  const headers = new Headers(req.headers);
  headers.set('host', new URL(API).host);
  headers.set('authorization', at ? `Bearer ${at}` : '');
  headers.delete('cookie'); // 우리 쿠키가 백엔드로 새어 나가지 않게

  const init: RequestInit = {
    method: req.method,
    headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text(),
    cache: 'no-store',
    redirect: 'manual',
  };

  return fetch(url, init);
}

async function tryReissue(origin: URL) {
  const res = await fetch(new URL('/api/auth/reissue', origin).toString(), { cache: 'no-store' });
  return res.ok;
}

async function handle(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;          // ✅ Promise에서 꺼내기
  const joined = path.join('/');

  let res = await forward(req, joined);

  if (res.status === 401) {
    const ok = await tryReissue(new URL(req.url));
    if (ok) res = await forward(req, joined);
  }

  return new NextResponse(res.body, { status: res.status, headers: res.headers });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handle(req, ctx);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handle(req, ctx);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handle(req, ctx);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handle(req, ctx);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handle(req, ctx);
}