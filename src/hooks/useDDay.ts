// src/hooks/useDDay.ts
'use client';

import { formatDDayLabel, getDDay } from '@/lib/dday';
import { parseJwt } from '@/lib/jwt';
import { useMemo } from 'react';

export function useDDayFromToken(token?: string | null, opts?: { clampPastToZero?: boolean; tz?: string }) {
  return useMemo(() => {
    const j = parseJwt(token);
    const dateStr = j?.weddingDate;
    const d = dateStr ? getDDay(dateStr, opts) : null;
    return {
      date: dateStr ?? null,
      dday: d,
      label: d == null ? '' : formatDDayLabel(d),
    };
  }, [token, opts?.clampPastToZero, opts?.tz]);
}