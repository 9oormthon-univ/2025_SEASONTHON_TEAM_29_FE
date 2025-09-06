// src/services/couple.api.ts
import { tokenStore } from '@/lib/tokenStore';
import { http, type ApiEnvelope } from '@/services/http';

function extractCoupleCode(payload: unknown): string | null {
  if (typeof payload === 'string') return payload.trim();
  if (!payload || typeof payload !== 'object') return null;

  const obj = payload as Record<string, unknown>;
  const top =
    (typeof obj.coupleCode === 'string' && obj.coupleCode) ||
    (typeof obj.code === 'string' && obj.code);
  if (top) return String(top);

  const data = obj.data as Record<string, unknown> | undefined;
  if (data && typeof data === 'object') {
    const inner =
      (typeof data.coupleCode === 'string' && data.coupleCode) ||
      (typeof data.code === 'string' && data.code);
    if (inner) return String(inner);
  }
  return null;
}

/** 내 커플 코드 생성 (인증 필요) */
export async function generateCoupleCode(): Promise<string> {
  // 1) http 래퍼 우선 시도
  try {
    const res = await http<ApiEnvelope<unknown>>('/v1/couple/code', { method: 'GET' });
    const fromData = extractCoupleCode(res?.data);
    const fromWhole = extractCoupleCode(res as unknown); // 혹시 envelope 형태가 다를 때
    const code = fromData ?? fromWhole;
    if (code) return code;
  } catch {
    // http 래퍼가 text/plain을 못 읽어 실패했을 수 있음 → 아래 fallback으로 진행
  }

  // 2) fallback: 원시 fetch로 content-type 감지
  const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
  if (!API) throw new Error('API URL이 설정되지 않았어요.');

  const rawToken = tokenStore.get();
  if (!rawToken) throw new Error('로그인 후 다시 시도해주세요.');

  const bearer = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

  const r = await fetch(`${API}/v1/couple/code`, {
    method: 'GET',
    headers: { Authorization: bearer },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`코드 생성 실패 (${r.status})`);

  const ct = r.headers.get('content-type') || '';
  const body = ct.includes('application/json') ? await r.json() : await r.text();
  const code = extractCoupleCode(body);

  if (!code) throw new Error('서버에서 커플 코드가 내려오지 않았어요.');
  return code;
}

/** 상대 커플 코드로 연결 (인증 필요) */
export async function connectCouple(code: string): Promise<void> {
  const trimmed = code.trim();
  console.log(trimmed);
  if (!trimmed) throw new Error('코드를 입력해주세요.');
  await http<ApiEnvelope<unknown>>('/v1/couple/connect', {
    method: 'POST',
    body: JSON.stringify({ coupleCode: trimmed }),
  });
}