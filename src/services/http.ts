// src/services/http.ts
import { refreshStore } from '@/lib/refreshStore';
import { tokenStore } from '@/lib/tokenStore';

const BASE = '/api';

type HttpInit = RequestInit & { skipAuth?: boolean };
export type ApiEnvelope<T> = { status: number; success: boolean; message?: string; data?: T };

function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path;
  const site =
    process.env.NEXT_PUBLIC_SITE_URL;
  return new URL(path, site).toString();
}

function toHeaderRecord(h?: HeadersInit): Record<string, string> {
  if (!h) return {};
  if (h instanceof Headers) return Object.fromEntries(h.entries());
  if (Array.isArray(h)) return Object.fromEntries(h);
  return h as Record<string, string>;
}

/** ---------- 동시 리프레시 제어 (stampede 방지) ---------- */
let refreshPromise: Promise<boolean> | null = null;

async function reissueOnce(): Promise<boolean> {
  if (refreshPromise) return refreshPromise; // 이미 진행 중이면 공유

  refreshPromise = (async () => {
    const rt = refreshStore.get();
    if (!rt) return false;

    const res = await fetch(absoluteUrl(`${BASE}/v1/member/reissue`), {
      method: 'POST',
      headers: { Authorization: `Bearer ${rt}` },
      cache: 'no-store',
    }).catch(() => null);

    if (!res || !res.ok) return false;

    const json = (await res.json().catch(() => ({}))) as ApiEnvelope<{
      accessToken?: string;
      refreshToken?: string;
    }>;

    const newAT = json?.data?.accessToken;
    const newRT = json?.data?.refreshToken;

    if (newAT) tokenStore.set(newAT);
    if (newRT) refreshStore.set(newRT);

    return !!newAT;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null; // 끝나면 초기화
  }
}

function redirectToLogin() {
  if (typeof window === 'undefined') return;
  const next = encodeURIComponent(window.location.pathname || '/');
  // 저장된 토큰 제거
  tokenStore.clear?.();
  refreshStore.clear?.();
  window.location.replace(`/login?next=${next}`);
}

export async function http<T>(path: string, init: HttpInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...toHeaderRecord(init.headers),
  };

  // JSON 바디가 있으면 Content-Type 기본값 채우기
  if (init.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // 클라 환경 + 인증 필요 시 Authorization 자동첨부
  if (typeof window !== 'undefined' && !init.skipAuth) {
    const at = tokenStore.get();
    if (at) headers['Authorization'] = `Bearer ${at}`;
  }

  const url = absoluteUrl(`${BASE}${path}`);

  // 첫 요청
  let res: Response | null = null;
  try {
    res = await fetch(url, { ...init, headers, cache: init.cache ?? 'no-store' });
  } catch {
    throw new Error('네트워크 오류가 발생했습니다.');
  }

  // 401 → 한 번만 리프레시 & 재시도
  if (res.status === 401 && !init.skipAuth && typeof window !== 'undefined') {
    const ok = await reissueOnce();
    if (ok) {
      const retriedHeaders: Record<string, string> = {
        ...headers,
        Authorization: `Bearer ${tokenStore.get() || ''}`,
      };
      res = await fetch(url, { ...init, headers: retriedHeaders, cache: init.cache ?? 'no-store' });
    } else {
      // 리프레시 실패 → 로그인
      redirectToLogin();
      throw new Error('인증이 만료되었습니다.');
    }
  }

  if (!res.ok) throw await toErr(res);
  return safeJson<T>(res);
}

async function toErr(res: Response) {
  const text = await res.text().catch(() => '');
  return new Error(text || `HTTP ${res.status}`);
}

async function safeJson<T>(res: Response): Promise<T> {
  // 204 등 바디 없는 응답 처리
  const txt = await res.text().catch(() => '');
  if (!txt) return {} as T;
  try {
    return JSON.parse(txt) as T;
  } catch {
    return {} as T;
  }
}