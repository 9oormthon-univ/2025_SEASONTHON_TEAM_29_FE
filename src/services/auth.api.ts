// src/services/auth.api.ts
import { SocialSignupPayload } from '@/types/auth';
import { http, type ApiEnvelope } from './http';

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

// 로그인  👉  우리 서버 라우트 호출로 변경
export async function login(payload: { email: string; password: string }) {
  const res = await http<ApiEnvelope<unknown>>(
    "/auth/login",
    { method: "POST", body: JSON.stringify(payload), skipAuth: true }
  );
  // 토큰은 서버에서 쿠키로 세팅되므로 클라에서 저장할 일 없음
  return res;
}

// 로그아웃(선택) - 쿠키 삭제용 서버 라우트 만들면 호출
export async function logout() {
  await http("/auth/logout", { method: "POST", skipAuth: true }).catch(() => {});
}

// SMS 전송/검증은 그대로 (백엔드가 공개라면 skipAuth: true)
export function sendSms(phoneNumber: string) {
  return http("/v1/member/verify-phone", {
    method: "POST",
    body: JSON.stringify({ phoneNumber }),
    skipAuth: true,
  });
}

export function verifySms(code: string) {
  return http("/v1/member/verification-phone-code", {
    method: "POST",
    body: JSON.stringify({ code }),
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