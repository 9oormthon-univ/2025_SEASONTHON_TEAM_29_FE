// src/services/calendar.api.ts
import { http, type ApiEnvelope } from '@/services/http';
import type { CalendarEventDto, CalendarMonthType } from '@/types/calendar';

const BASE = '/v1/calendar/events';

export async function fetchMonthlyEvents(params: {
  year: number;
  month: number;           // 1~12
  type: CalendarMonthType; // 'USER' | 'ADMIN'
  signal?: AbortSignal;    // ✅ 선택: 중복요청 취소용
}) {
  const qs = new URLSearchParams({
    year: String(params.year),
    month: String(params.month),
    type: params.type,
  });
  const res = await http<ApiEnvelope<CalendarEventDto[]>>(`${BASE}?${qs.toString()}`, {
    method: 'GET',
    signal: params.signal, // ✅ 전달
  });
  return res.data ?? [];
}

export type CreateCalendarEventPayload = {
  title: string;
  description?: string;
  eventCategory: string;
  startDateTime: string;
  endDateTime: string;
  isAllDay: boolean;
};

export async function createCalendarEvent(payload: CreateCalendarEventPayload) {
  return http<ApiEnvelope<unknown>>(BASE, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export type UpdateCalendarEventPayload = {
  title?: string;
  description?: string;
  eventCategory?: string;
};

export async function updateCalendarEvent(eventId: number, payload: UpdateCalendarEventPayload) {
  return http<ApiEnvelope<unknown>>(`${BASE}/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteCalendarEvent(eventId: number) {
  return http<ApiEnvelope<unknown>>(`${BASE}/${eventId}`, {
    method: 'DELETE',
  });
}