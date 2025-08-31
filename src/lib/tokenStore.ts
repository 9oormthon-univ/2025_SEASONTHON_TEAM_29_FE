import Cookies from "js-cookie";

const KEY = "accessToken";
const isBrowser = typeof window !== "undefined";
const isProd = isBrowser && location.hostname.endsWith("wedit.me");

const baseOpts = {
  sameSite: "lax" as const,
  path: "/",
  expires: 1, // 보통 AT는 1일 정도 (서버 설정과 맞추세요)
};

const prodOpts = isProd
  ? { secure: true, domain: ".wedit.me" }
  : { secure: false };

export const tokenStore = {
  get: () => Cookies.get(KEY) || null,
  set: (t: string) => Cookies.set(KEY, t, { ...baseOpts, ...prodOpts }),
  clear: () => Cookies.remove(KEY, { path: "/", ...(isProd ? { domain: ".wedit.me" } : {}) }),
};