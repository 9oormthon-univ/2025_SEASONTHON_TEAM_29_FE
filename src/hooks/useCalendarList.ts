// src/hooks/useCalendarList.ts
'use client';

import { STICKER_SRC } from '@/components/calendar/stickers';
import { dateRangeYMD, mapCategoryToSticker } from '@/lib/calendar';
import { fetchMonthlyEvents } from '@/services/calendar.api';
import type { CalendarEventDto } from '@/types/calendar';
import { useEffect, useRef, useState } from 'react';

export type RowItem = {
  id: string;
  date: string;   // 'YYYY-MM-DD'
  title: string;
  sticker: keyof typeof STICKER_SRC;
};

function expandDtoToRows(dto: CalendarEventDto): RowItem[] {
  const sticker = mapCategoryToSticker(dto.eventCategory);
  const days = dateRangeYMD(dto.startDateTime, dto.endDateTime);
  return days.map((ymd) => ({
    id: `${dto.id}-${ymd}`, // 일자별로 고유
    date: ymd,
    title: dto.title,
    sticker,
  }));
}

export function useCalendarList(params: {
  year: number;
  month: number;
  type: 'USER' | 'ADMIN';
  pickedDate?: string; // 'YYYY-MM-DD'
}) {
  const [rows, setRows] = useState<RowItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const acRef = useRef<AbortController | null>(null);

  useEffect(() => {
    acRef.current?.abort();
    const ac = new AbortController();
    acRef.current = ac;

    setLoading(true);
    setError(null);

    fetchMonthlyEvents({
      year: params.year,
      month: params.month,
      type: params.type,
      signal: ac.signal,
    })
      .then((list) => {
        const all = list.flatMap(expandDtoToRows);
        const filtered = params.pickedDate
          ? all.filter((r) => r.date === params.pickedDate)
          : all.filter((r) => r.date.startsWith(`${params.year}-${String(params.month).padStart(2, '0')}`));
        filtered.sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : a.date.localeCompare(b.date)));
        setRows(filtered);
      })
      .catch((e) => {
        if (ac.signal.aborted) return;
        setError(e?.message ?? '캘린더 목록 불러오기 실패');
        setRows([]);
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });

    return () => ac.abort();
  }, [params.year, params.month, params.type, params.pickedDate]);

  return { rows, loading, error };
}