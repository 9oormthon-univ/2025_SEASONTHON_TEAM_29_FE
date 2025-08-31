import Cookies from "js-cookie";

const KEY = "refreshToken";
const isBrowser = typeof window !== "undefined";
const isProd = isBrowser && location.hostname.endsWith("wedit.me");

const baseOpts = {
  sameSite: "lax" as const,
  path: "/",
  expires: 7, // 보통 RT는 7일 이상
};

const prodOpts = isProd
  ? { secure: true, domain: ".wedit.me" }
  : { secure: false };

export const refreshStore = {
  get: () => Cookies.get(KEY) || null,
  set: (t: string) => Cookies.set(KEY, t, { ...baseOpts, ...prodOpts }),
  clear: () => Cookies.remove(KEY, { path: "/", ...(isProd ? { domain: ".wedit.me" } : {}) }),
};