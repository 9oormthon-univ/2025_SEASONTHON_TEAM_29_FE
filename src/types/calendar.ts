// src/types/calendar.ts
import type { StickerKey } from '@/components/calendar/stickers';

export type EventItem = {
  id: string;
  date: string;      // 'YYYY-MM-DD'
  sticker: StickerKey;
};