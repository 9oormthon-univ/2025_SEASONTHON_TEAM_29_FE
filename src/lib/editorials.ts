// src/lib/editorials.ts
import { editorials } from '@/data/editorialsData';

export function getEditorialById(id: number) {
  return editorials.find((e) => e.id === id) ?? null;
}

export function getAllEditorials() {
  // 최신순 정렬 (원하면 유지)
  return [...editorials].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
}

// 🔽 배너용 변환
export function getEditorialBanners() {
  return getAllEditorials().map((e) => ({
    id: e.id,
    href: `/editorials/${e.id}`,
    title: e.title,
    sub: e.desc,
    color: e.bannerColor ?? 'white',
    src: e.heroSrc,             // 🔁 이제 이미지 사용
    alt: e.title,
  }));
}