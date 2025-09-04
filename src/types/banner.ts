// src/types/banner.ts
export type BannerColor = 'black' | 'white';

export type BannerItem = {
  id: number;
  src: string;        // ✅ 문자열 경로로 변경
  href: string;
  alt: string;
  title: string;      // \n 가능
  sub: string;
  color: BannerColor;
};