import { refreshStore } from "@/lib/refreshStore";
import { tokenStore } from "@/lib/tokenStore";
import { ApiEnvelope, http } from "./http";

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
  return http("/v1/member/signup", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

// 로그인
export async function login(payload: { email: string; password: string }) {
  const res = await http<ApiEnvelope<{ accessToken?: string; refreshToken?: string }>>(
    "/v1/member/login",
    { method: "POST", body: JSON.stringify(payload), skipAuth: true }
  );

  const at = res.data?.accessToken;
  const rt = res.data?.refreshToken;

  if (at) tokenStore.set(at);
  if (rt) refreshStore.set(rt);

  return res;
}

// 로그아웃
export async function logout() {
  tokenStore.clear();
  refreshStore.clear();
}

// SMS 전송
export function sendSms(phoneNumber: string) {
  return http("/v1/member/verify-phone", {
    method: "POST",
    body: JSON.stringify({ phoneNumber }),
    skipAuth: true,
  });
}

// SMS 인증 코드 검증
export function verifySms(code: string) {
  return http("/v1/member/verification-phone-code", {
    method: "POST",
    body: JSON.stringify({ code }),
    skipAuth: true,
  });
}

// 토큰 재발급
export async function reissueToken(): Promise<boolean> {
  const rt = refreshStore.get();
  if (!rt) return false;

  const res = await fetch("/api/v1/member/token-reissue", {
    method: "GET",
    headers: { "X-Refresh-Token": `Bearer ${rt}` },
  });
  if (!res.ok) return false;

  const authHeader = res.headers.get("authorization");
  const newRT = res.headers.get("x-refresh-token");
  const newAT = authHeader?.replace(/^Bearer\s+/i, "") || "";

  if (newAT) tokenStore.set(newAT);
  if (newRT) refreshStore.set(newRT);

  return !!tokenStore.get();
}