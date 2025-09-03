// src/services/http.ts
const BASE = '/api';

type HttpInit = RequestInit & { skipAuth?: boolean };

export type ApiEnvelope<T> = { status: number; success: boolean; message?: string; data?: T };

function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path;
  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000';
  return new URL(path, site).toString();
}

function toHeaderRecord(h?: HeadersInit): Record<string, string> {
  if (!h) return {};
  if (h instanceof Headers) return Object.fromEntries(h.entries());
  if (Array.isArray(h)) return Object.fromEntries(h);
  return h as Record<string, string>;
}

export async function http<T>(path: string, init: HttpInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...toHeaderRecord(init.headers),
  };

  const url = absoluteUrl(`${BASE}${path}`);
  const res = await fetch(url, { ...init, headers, cache: init.cache ?? 'no-store', credentials: 'include' });

  if (!res.ok) throw await toErr(res);
  return safeJson<T>(res);
}

async function toErr(res: Response) {
  const text = await res.text().catch(() => '');
  return new Error(text || `HTTP ${res.status}`);
}

async function safeJson<T>(res: Response): Promise<T> {
  try { return (await res.json()) as T; } catch { return {} as T; }
}