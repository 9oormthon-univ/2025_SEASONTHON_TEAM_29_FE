import type { StaticImageData } from 'next/image';

export type ReviewItem = {
  id: number;
  src: string | StaticImageData | null;
  href: string;
  alt: string;
  category: string;
  title: string;
  rings: number;
};