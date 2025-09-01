// src/data/dressOptions.ts
import type { DressLine, DressMaterial, DressNeckline } from "@/types/dress";

export const dressMaterials: DressMaterial[] = ["실크", "비즈", "쉬폰", "레이스"];

export const dressNecklines: DressNeckline[] = [
  {
    id: 'neck1',
    name: 'neck1',
    thumb: '/fitting/necklines/neckline1.svg',
    overlay: '/fitting/necklines/neckline1.svg',
    fit: { scale: 0.11, offset: { y: -17 } }
  },
  {
    id: 'neck2',
    name: 'neck2',
    thumb: '/fitting/necklines/neckline2.svg',
    overlay: '/fitting/necklines/neckline2.svg',
    fit: { scale: 0.11, offset: { y: -19.5 } }
  },
  {
    id: 'neck3',
    name: 'neck3',
    thumb: '/fitting/necklines/neckline3.svg',
    overlay: '/fitting/necklines/neckline3.svg',
    fit: { scale: 0.15, offset: { y: -19 } }
  },
  {
    id: 'neck4',
    name: 'neck4',
    thumb: '/fitting/necklines/neckline4.svg',
    overlay: '/fitting/necklines/neckline4.svg',
    fit: { scale: 0.15, offset: { y: -18.5 } }
  },
  {
    id: 'neck5',
    name: 'neck5',
    thumb: '/fitting/necklines/neckline5.svg',
    overlay: '/fitting/necklines/neckline5.svg',
    fit: { scale: 0.1, offset: { y: -19.5 } }
  },
  {
    id: 'neck6',
    name: 'neck6',
    thumb: '/fitting/necklines/neckline6.svg',
    overlay: '/fitting/necklines/neckline6.svg',
    fit: { scale: 0.116, offset: { x:-0.11 ,y: -20.5 } }
  },
  {
    id: 'neck7',
    name: 'neck7',
    thumb: '/fitting/necklines/neckline7.svg',
    overlay: '/fitting/necklines/neckline7.svg',
    fit: { scale: 0.13, offset: { y: -19 } }
  },
];

export const dressLines: DressLine[] = [
  {
    id: 'line1',
    name: 'line1',
    thumb: '/fitting/lines/line1.svg',
    overlay: '/fitting/lines/line1.svg',
    fit: { scale: 0.48, offset: { y: 12.3 } }
  },
  {
    id: 'line2',
    name: 'line2',
    thumb: '/fitting/lines/line2.svg',
    overlay: '/fitting/lines/line2.svg',
    fit: { scale: 0.42, offset: { x:-0.8, y: 8 } }
  },
  {
    id: 'line3',
    name: 'line3',
    thumb: '/fitting/lines/line3.svg',
    overlay: '/fitting/lines/line3.svg',
    fit: { scale: 0.43, offset: { x:-0.2, y: 4 } }
  },
  {
    id: 'line4',
    name: 'line4',
    thumb: '/fitting/lines/line4.svg',
    overlay: '/fitting/lines/line4.svg',
    fit: { scale: 0.5, offset: { y: 11.3 } }
  },
  {
    id: 'line5',
    name: 'line5',
    thumb: '/fitting/lines/line5.svg',
    overlay: '/fitting/lines/line5.svg',
    fit: { scale: 0.4, offset: { y: 6 } }
  },
  {
    id: 'line6',
    name: 'line6',
    thumb: '/fitting/lines/line6.svg',
    overlay: '/fitting/lines/line6.svg',
    fit: { scale: 0.25, offset: { y: -3 } }
  },
  {
    id: 'line7',
    name: 'line7',
    thumb: '/fitting/lines/line7.svg',
    overlay: '/fitting/lines/line7.svg',
    fit: { scale: 0.25, offset: { y: -1 } }
  },
];