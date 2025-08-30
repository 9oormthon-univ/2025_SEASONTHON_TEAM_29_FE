// src/services/http.ts
import { refreshStore } from '@/lib/refreshStore';
import { tokenStore } from '@/lib/tokenStore';

const BASE = '/api';

type HttpInit = RequestInit & { skipAuth?: boolean };

export type ApiEnvelope<T> = {
  status: number;
  success: boolean;
  message?: string;
  data?: T;
};

export async function http<T>(path: string, init: HttpInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as any),
  };

  const at = tokenStore.get();
  if (at && !init.skipAuth) headers.Authorization = `Bearer ${at}`;

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (res.status === 401 && !init.skipAuth) {
    const ok = await tryRefresh();
    if (ok) {
      const retry = await fetch(`${BASE}${path}`, {
        ...init,
        headers: {
          ...headers,
          Authorization: `${tokenStore.get()}`,
        },
      });
      if (!retry.ok) throw await toErr(retry);
      return safeJson<T>(retry);
    }
  }

  if (!res.ok) throw await toErr(res);
  return safeJson<T>(res);
}

async function tryRefresh(): Promise<boolean> {
  const rt = refreshStore.get();
  if (!rt) return false;

  const res = await fetch('/api/v1/member/token-reissue', {
    method: 'GET',
    headers: { 'X-Refresh-Token': `Bearer ${rt}` },
  });
  if (!res.ok) return false;

  const newAT = res.headers.get('X-Access-Token');
  const newRT = res.headers.get('X-Refresh-Token');

  if (newAT) tokenStore.set(newAT);
  if (newRT) refreshStore.set(newRT);

  if (!newAT || !newRT) {
    const body = await res.json().catch(() => null);
    if (body?.accessToken) tokenStore.set(body.accessToken);
    if (body?.refreshToken) refreshStore.set(body.refreshToken);
  }
  return !!tokenStore.get();
}

async function toErr(res: Response) {
  const text = await res.text().catch(() => '');
  return new Error(text || `HTTP ${res.status}`);
}
async function safeJson<T>(res: Response): Promise<T> {
  try { return (await res.json()) as T; } catch { return {} as T; }
}