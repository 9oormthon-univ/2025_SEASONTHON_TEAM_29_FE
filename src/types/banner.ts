import type { StaticImageData } from 'next/image';

export type BannerColor = 'black' | 'white';

export type BannerItem = {
  id: number;
  src: StaticImageData | null;
  href: string;
  alt: string;
  title: string; // \n 포함 가능
  sub: string;
  color: BannerColor;
};