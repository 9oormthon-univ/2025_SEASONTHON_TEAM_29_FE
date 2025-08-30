// src/lib/refreshStore.ts
import Cookies from 'js-cookie';

const KEY = 'refreshToken';
const isBrowser = typeof window !== 'undefined';
const isProd = isBrowser && location.hostname.endsWith('wedit.me');
const onWww = isBrowser && location.hostname.startsWith('www.');

const baseOpts = {
  sameSite: 'lax' as const,
  path: '/',
  expires: 7,
};

// prod에선 secure + 루트 도메인으로 고정
const prodOpts = isProd
  ? { secure: true, domain: '.wedit.me' }
  : { secure: false };

export const refreshStore = {
  get: () => Cookies.get(KEY) || null,
  set: (t: string) => Cookies.set(KEY, t, { ...baseOpts, ...prodOpts }),
  clear: () => Cookies.remove(KEY, { path: '/', ...(isProd ? { domain: '.wedit.me' } : {}) }),
};