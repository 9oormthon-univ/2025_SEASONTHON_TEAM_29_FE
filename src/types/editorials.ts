// src/types/editorials.ts
export type Editorial = {
  id: number;
  tags: string[];
  title: string;
  sub: string;
  dateISO: string;
  contentPath: string;
  photoSource?: string;
  editor?: string;
  thumbnail: string;
  heroSrc: string;
  desc: string;
  bannerColor?: 'black' | 'white';
  logoVariant?: 'b' | 'g';
};