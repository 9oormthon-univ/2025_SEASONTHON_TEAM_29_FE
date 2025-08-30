const BASE = '/api';

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  try {
    return (await res.json()) as T;
  } catch {
    return {} as T;
  }
}

// 회원가입
export function signup(payload: {
  email: string; password: string; name: string;
  phoneNumber: string; birthDate: string; weddingDate: string;
  type: 'GROOM'|'BRIDE';
}) {
  return req('/v1/member/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// SMS 전송
export function sendSms(phoneNumber: string) {
  return req('/v1/member/verify-phone', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
  });
}

// SMS 인증 코드 검증
export function verifySms(code: string) {
  return req('/v1/member/verification-phone-code', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

// 로그인
export function login(payload:{email:string;password:string}) {
  const r = req('/v1/member/login', {
    method:'POST',
    body: JSON.stringify(payload),
  });
  console.log(r);
  return r;
}

// 토큰 재발급
export function reissueToken(refreshToken:string) {
  return req('/v1/member/token-reissue', {
    method:'GET',
    headers:{ 'X-Refresh-Token': refreshToken },
  });
}