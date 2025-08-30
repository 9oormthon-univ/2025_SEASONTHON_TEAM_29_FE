// src/lib/refreshStore.ts
import Cookies from 'js-cookie';

const KEY = 'refreshToken';

export const refreshStore = {
  get: () => Cookies.get(KEY) || null,
  set: (t: string) => {
    Cookies.set(KEY, t, {
      sameSite: 'lax',
      secure: false,   // ← 로컬(dev)은 무조건 false로 고정 추천
      path: '/',       // 전체 경로
      expires: 7,
    });
  },
  clear: () => Cookies.remove(KEY, { path: '/' }),
};