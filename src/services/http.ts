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

function absoluteUrl(path: string) {
  // 브라우저에선 상대 경로 OK
  if (typeof window !== 'undefined') return path;

  // 서버에선 절대 경로 필요
  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||            // 예: https://wed-it.me
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000';

  return new URL(path, site).toString();
}


function toHeaderRecord(h?: HeadersInit): Record<string, string> {
  if (!h) return {};
  if (h instanceof Headers) {
    return Object.fromEntries(h.entries());
  }
  if (Array.isArray(h)) {
    return Object.fromEntries(h);
  }
  return h as Record<string, string>;
}

export async function http<T>(path: string, init: HttpInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...toHeaderRecord(init.headers),
  };

  const at = tokenStore.get();
  if (at && !init.skipAuth) {
    headers.Authorization = `Bearer ${at}`;
  }

  let url = absoluteUrl(`${BASE}${path}`);
  let res = await fetch(url, { ...init, headers });

  if (res.status === 401 && !init.skipAuth) {
    const ok = await tryRefresh();
    if (ok) {
      const retryHeaders: Record<string, string> = {
        ...headers,
        Authorization: `Bearer ${tokenStore.get() || ''}`,
      };
      url = absoluteUrl(`${BASE}${path}`);
      res = await fetch(url, { ...init, headers: retryHeaders });
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

  const authHeader = res.headers.get('authorization');
  const newRT = res.headers.get('x-refresh-token');
  const newAT = authHeader?.replace(/^Bearer\s+/i, '') || '';

  if (newAT) tokenStore.set(newAT);
  if (newRT) refreshStore.set(newRT);

  return !!tokenStore.get();
}

async function toErr(res: Response) {
  const text = await res.text().catch(() => '');
  return new Error(text || `HTTP ${res.status}`);
}

async function safeJson<T>(res: Response): Promise<T> {
  try {
    return (await res.json()) as T;
  } catch {
    return {} as T;
  }
}