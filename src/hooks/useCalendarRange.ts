// src/hooks/useCalendarRange.ts
'use client';

import { buildDateMaps, type SheetEntry } from '@/lib/calendar';
import { fetchMonthlyEvents } from '@/services/calendar.api';
import type { EventItem } from '@/types/calendar';
import { useEffect, useState } from 'react';

type MonthMaps = { grid: Map<string, EventItem[]>; sheet: Map<string, SheetEntry[]> };

export function useCalendarRange(base: Date, type: 'USER' | 'ADMIN') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maps, setMaps] = useState<Record<string, MonthMaps>>({});

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    const targets = [-1, 0, 1].map((offset) => {
      const d = new Date(base);
      d.setMonth(d.getMonth() + offset);
      return { year: d.getFullYear(), month: d.getMonth() + 1, key: `${d.getFullYear()}-${d.getMonth() + 1}` };
    });

    Promise.all(
      targets.map((t) =>
        fetchMonthlyEvents({ year: t.year, month: t.month, type })
          .then((list) => ({ key: t.key, val: buildDateMaps(list ?? []) }))
          .catch(() => ({ key: t.key, val: { grid: new Map(), sheet: new Map() } })),
      ),
    )
      .then((arr) => {
        if (!alive) return;
        const next: Record<string, MonthMaps> = {};
        for (const { key, val } of arr) next[key] = val;
        setMaps(next);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message ?? '캘린더 로딩 실패');
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [base, type]);

  return { maps, loading, error };
}