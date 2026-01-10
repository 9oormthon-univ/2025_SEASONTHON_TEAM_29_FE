import { refreshStore } from '@/lib/refreshStore';
import { tokenStore } from '@/lib/tokenStore';

const BASE = '/api';
const REISSUE_PATH = '/v1/member/token-reissue';
const REFRESH_HEADER = 'X-Refresh-Token';

type HttpInit = RequestInit & { skipAuth?: boolean };
export type ApiEnvelope<T> = {
  status: number;
  success: boolean;
  message?: string;
  data?: T;
};

function absoluteUrl(path: string) {
  // 클라이언트 사이드: 상대 경로 반환 (rewrites가 작동)
  if (typeof window !== 'undefined') return path;
  
  // 서버 사이드: NEXT_PUBLIC_API_URL 직접 사용 (rewrites가 작동하지 않음)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL이 설정되지 않았습니다.');
  }
  
  // path가 이미 /api로 시작하면 제거하고 API URL과 결합
  const cleanPath = path.startsWith('/api') ? path.replace('/api', '') : path;
  return `${apiUrl}${cleanPath}`;
}

function toHeaderRecord(h?: HeadersInit): Record<string, string> {
  if (!h) return {};
  if (h instanceof Headers) return Object.fromEntries(h.entries());
  if (Array.isArray(h)) return Object.fromEntries(h);
  return h as Record<string, string>;
}

/** ---------- 동시 리프레시 제어 (stampede 방지) ---------- */
let refreshPromise: Promise<boolean> | null = null;

export async function reissueOnce(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const rt = refreshStore.get();
    if (!rt) return false;

    // 변경점: GET + X-Refresh-Token 헤더 사용
    const res = await fetch(absoluteUrl(`${BASE}${REISSUE_PATH}`), {
      method: 'GET',
      headers: {
        // 스웨거 주석대로 Bearer 프리픽스 포함
        [REFRESH_HEADER]: `Bearer ${rt}`,
      },
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
    refreshPromise = null;
  }
}

function redirectToLogin() {
  if (typeof window === 'undefined') return;
  const next = encodeURIComponent(window.location.pathname || '/');
  tokenStore.clear?.();
  refreshStore.clear?.();
  window.location.replace(`/login?next=${next}`);
}

export async function http<T>(path: string, init: HttpInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...toHeaderRecord(init.headers),
  };

  // JSON 바디가 있으면 Content-Type 기본값
  if (init.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // 인증 필요 시 Authorization 자동첨부
  if (!init.skipAuth) {
    let token: string | null = null;
    
    if (typeof window !== 'undefined') {
      // 클라이언트 사이드: js-cookie 사용
      token = tokenStore.get();
    } else {
      // 서버 사이드: Next.js cookies() 사용
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        token = cookieStore.get('accessToken')?.value || null;
      } catch {
        // cookies()를 사용할 수 없는 환경 (예: 빌드 타임)
        token = null;
      }
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = absoluteUrl(`${BASE}${path}`);

  // 서버 사이드 디버깅 로그
  if (typeof window === 'undefined') {
    console.log('[http] Server-side request:', {
      path: `${BASE}${path}`,
      absoluteUrl: url,
      hasAuth: !!headers['Authorization'],
      skipAuth: init.skipAuth,
    });
  }

  let res: Response | null = null;
  try {
    res = await fetch(url, {
      ...init,
      headers,
      cache: init.cache ?? 'no-store',
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.';
    if (typeof window === 'undefined') {
      console.error('[http] Fetch error:', {
        url,
        error: errorMsg,
      });
    }
    throw new Error(errorMsg);
  }

  // 401 → 한 번만 리프레시 & 재시도
  if (res.status === 401 && !init.skipAuth && typeof window !== 'undefined') {
    const ok = await reissueOnce();
    if (ok) {
      const retriedHeaders: Record<string, string> = {
        ...headers,
        Authorization: `Bearer ${tokenStore.get() || ''}`,
      };
      res = await fetch(url, {
        ...init,
        headers: retriedHeaders,
        cache: init.cache ?? 'no-store',
      });
    } else {
      redirectToLogin();
      throw new Error('인증이 만료되었습니다.');
    }
  }

  if (!res.ok) {
    const error = await toErr(res);
    if (typeof window === 'undefined') {
      console.error('[http] Response error:', {
        url,
        status: res.status,
        statusText: res.statusText,
        error: error.message,
      });
    }
    throw error;
  }
  return safeJson<T>(res);
}

async function toErr(res: Response) {
  const text = await res.text().catch(() => '');
  return new Error(text || `HTTP ${res.status}`);
}

async function safeJson<T>(res: Response): Promise<T> {
  try {
    const r = res.clone();
    return (await r.json()) as T;
  } catch {
    try {
      const t = await res.text();
      return t ? (JSON.parse(t) as T) : ({} as T);
    } catch {
      return {} as T;
    }
  }
}