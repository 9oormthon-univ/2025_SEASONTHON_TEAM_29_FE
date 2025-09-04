// src/services/auth.api.ts
import { refreshStore } from '@/lib/refreshStore';
import { tokenStore } from '@/lib/tokenStore';
import { SocialSignupPayload } from '@/types/auth';
import { http, type ApiEnvelope } from './http';

type LoginData = { accessToken?: string; refreshToken?: string };
type BaseEnvelope<T> = { status: number; success: boolean; message?: string; data?: T };

// 회원가입
export function signup(payload: {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  birthDate: string;
  weddingDate: string;
  type: "GROOM" | "BRIDE";
}) {
  return http("/auth/signup", { // ← 백엔드가 /v1/member/signup이면 /api/auth/signup 프록시 라우트를 만들어도 OK
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}


export async function login(payload: { email: string; password: string }) {
  const res = await http<BaseEnvelope<LoginData>>('/v1/member/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });

  const at = res.data?.accessToken;
  const rt = res.data?.refreshToken;
  if (at) tokenStore.set(at);
  if (rt) refreshStore.set(rt);
  return res;
}

export async function logout() {
  tokenStore.clear();
  refreshStore.clear();
}

// SMS 전송/검증은 그대로 (백엔드가 공개라면 skipAuth: true)
export function sendSms(phoneNumber: string) {
  return http("/v1/member/verify-phone", {
    method: "POST",
    body: JSON.stringify({ phoneNumber }),
    skipAuth: true,
  });
}

export function verifySms(phoneNumber: string, code: string) {
  return http("/v1/member/verification-phone-code", {
    method: "POST",
    body: JSON.stringify({ phoneNumber, code }),
    skipAuth: true,
  });
}

type SocialSignupResponse = ApiEnvelope<string>;
// 소셜 회원가입(추가정보 입력)
export function socialSignup(payload: SocialSignupPayload) {
  return http<SocialSignupResponse>("/v1/member/social_login/additional_info", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: false,
  });
}