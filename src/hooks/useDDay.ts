// src/hooks/useDDay.ts
'use client';

import { formatDDayLabel, getDDay } from '@/lib/dday';
import { parseJwt } from '@/lib/jwt';
import { useMemo } from 'react';

export function useDDayFromToken(
  token?: string | null,
  opts?: { clampPastToZero?: boolean; tz?: string },
) {
  const { clampPastToZero, tz } = opts ?? {};
  return useMemo(() => {
    const j = parseJwt(token);
    const dateStr = j?.weddingDate ?? null;
    const d = dateStr ? getDDay(dateStr, { clampPastToZero, tz }) : null;
    return {
      date: dateStr,
      dday: d,
      label: d == null ? '' : formatDDayLabel(d),
    };
  }, [token, clampPastToZero, tz]);
}