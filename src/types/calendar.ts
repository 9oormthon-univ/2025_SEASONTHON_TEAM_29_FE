// src/types/calendar.ts
import type { StickerKey } from '@/components/calendar/stickers';

export type EventItem = {
  id: string;
  date: string;      // YYYY-MM-DD
  title: string;
  sticker: StickerKey;
};

export type CalendarEventDto = {
  id: number;
  title: string;
  description: string | null;
  eventCategory: string;            // 예: 'INVITATION' ...
  startDateTime: string;            // ISO8601: '2025-09-15T11:02:35.123Z'
  endDateTime: string;              // ISO8601
  allDay: boolean;
  vendorId?: number | null;
  eventSourceType?: 'USER' | 'ADMIN';
};

export type CalendarMonthType = 'USER' | 'ADMIN';