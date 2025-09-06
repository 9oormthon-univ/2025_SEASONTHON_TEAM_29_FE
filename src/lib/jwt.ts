// src/lib/jwt.ts

/** 표준 + 서비스 커스텀 클레임 */
export interface JwtPayload {
  // 표준
  exp: number;           // 만료(Epoch sec)
  iat: number;           // 발급(Epoch sec)
  sub: string;           // 사용자 id
  // 서비스 커스텀
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN' | string;
  type: 'ACCESS' | 'REFRESH' | string;
}

/** 런타임 타입가드: 구조가 맞는지 안전 확인 */
export function isJwtPayload(v: unknown): v is JwtPayload {
  const o = v as Record<string, unknown> | null;
  return !!o
    && typeof o.exp === 'number'
    && typeof o.iat === 'number'
    && typeof o.sub === 'string'
    && typeof o.email === 'string'
    && typeof o.role === 'string'
    && typeof o.type === 'string';
}

function b64urlToStr(b64url: string) {
  const pad = '='.repeat((4 - (b64url.length % 4)) % 4);
  const b64 = (b64url + pad).replace(/-/g, '+').replace(/_/g, '/');
  if (typeof atob === 'function') {
    // 브라우저
    return decodeURIComponent(escape(atob(b64)));
  }
  // Node
  return Buffer.from(b64, 'base64').toString('utf8');
}

export function parseJwt(token: string | undefined | null): JwtPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const raw = JSON.parse(b64urlToStr(parts[1]));
    console.log(raw);
    return isJwtPayload(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function isExpired(token: string | undefined | null, skewSec = 10): boolean {
  const j = parseJwt(token);
  if (!j) return true;
  const now = Math.floor(Date.now() / 1000);
  return j.exp <= now + skewSec;
}