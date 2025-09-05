'use client';

import CalendarToggle from '@/components/calendar/CalendarToggle';
import { STICKER_SRC } from '@/components/calendar/stickers';
import Header from '@/components/common/monocules/Header';
import { MOCK_EVENTS, MOCK_FAIRS } from '@/data/calendarData';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

type Mode = 'schedule' | 'event';

type RowItem = {
  id: string;
  date: string;                 // YYYY-MM-DD
  title: string;
  sticker: keyof typeof STICKER_SRC;
};

/* ── helpers ─────────────────────────────────────────────────────────────── */

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}
function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function inRange(d: Date, s: Date, e: Date) {
  const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return dd >= new Date(s.getFullYear(), s.getMonth(), s.getDate()) &&
         dd <= new Date(e.getFullYear(), e.getMonth(), e.getDate());
}

/** 해당 날짜(yyyy-mm-dd)에 열리는 행사들을 title 포함으로 펼친다 */
function fairsOnDate(ymdStr: string): RowItem[] {
  const d = new Date(ymdStr);
  const out: RowItem[] = [];
  for (const f of MOCK_FAIRS) {
    if (f.type === 'single') {
      if (ymd(f.date ? new Date(f.date) : new Date()) === ymdStr) {
        out.push({ id: f.id, date: ymdStr, title: f.title, sticker: 'hall' });
      }
    } else if (f.type === 'range') {
      if (inRange(d, new Date(f.start), new Date(f.end))) {
        out.push({ id: `${f.id}-${ymdStr}`, date: ymdStr, title: f.title, sticker: 'hall' });
      }
    } else {
      // weekends
      const dow = d.getDay();
      if (dow === 0 || dow === 6) {
        out.push({ id: `${f.id}-${ymdStr}`, date: ymdStr, title: f.title, sticker: 'hall' });
      }
    }
  }
  return out;
}

/** 해당 월의 모든 행사 일정들(title 포함) */
function fairsOfMonth(base: Date): RowItem[] {
  const y = base.getFullYear();
  const m = base.getMonth();
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0);

  const days: Date[] = [];
  for (let d = new Date(start); d <= end; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
    days.push(d);
  }

  const out: RowItem[] = [];
  for (const f of MOCK_FAIRS) {
    if (f.type === 'single') {
      const d = new Date(f.date);
      if (d.getFullYear() === y && d.getMonth() === m) {
        out.push({ id: f.id, date: ymd(d), title: f.title, sticker: 'hall' });
      }
    } else if (f.type === 'range') {
      for (const d of days) {
        if (inRange(d, new Date(f.start), new Date(f.end))) {
          out.push({ id: `${f.id}-${ymd(d)}`, date: ymd(d), title: f.title, sticker: 'hall' });
        }
      }
    } else {
      for (const d of days) {
        const dow = d.getDay();
        if (dow === 0 || dow === 6) {
          out.push({ id: `${f.id}-${ymd(d)}`, date: ymd(d), title: f.title, sticker: 'hall' });
        }
      }
    }
  }
  return out;
}

/* ── page ───────────────────────────────────────────────────────────────── */

export default function CalendarListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const qs = useSearchParams();

  // mode/scope
  const [mode, setMode] = useState<Mode>((qs.get('mode') as Mode) || 'schedule');
  const pickedDate = qs.get('date'); // 있으면 특정 날짜만
  const base = useMemo(() => {
    const dFromQs = qs.get('base'); // yyyy-mm (optional)
    if (dFromQs) {
      const [y, m] = dFromQs.split('-').map((n) => parseInt(n, 10));
      if (y && m) return new Date(y, m - 1, 1);
    }
    return new Date();
  }, [qs]);

  // 토글 변경 시 쿼리 유지하며 mode만 바꿈
  const onChangeMode = (v: Mode) => {
    setMode(v);
    const params = new URLSearchParams(qs.toString());
    params.set('mode', v);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const title = mode === 'event' ? '행사 모아보기' : '일정 모아보기';

  // 리스트 데이터
  const items: RowItem[] = useMemo(() => {
    if (mode === 'schedule') {
      const src = pickedDate
        ? MOCK_EVENTS.filter((e) => e.date === pickedDate)
        : MOCK_EVENTS.filter((e) => e.date.startsWith(monthKey(base)));
      return src
        .map<RowItem>((e) => ({ id: e.id, date: e.date, title: e.title, sticker: e.sticker }))
        .sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : a.date.localeCompare(b.date)));
    } else {
      const src = pickedDate ? fairsOnDate(pickedDate) : fairsOfMonth(base);
      return src.sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : a.date.localeCompare(b.date)));
    }
  }, [mode, pickedDate, base]);

  return (
    <main className="mx-auto w-full max-w-[420px] pb-[24px]">
      <Header
        value={title}
        rightSlot={
          <CalendarToggle
            value={mode}
            onChange={(v) => onChangeMode(v)}
            labels={{ event: '행사', schedule: '일정' }}
          />
        }
      />

      {/* 선택된 날짜 배지 (있을 때만) */}
      {pickedDate && (
        <div className="px-[22px] pt-2">
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-[12px] text-gray-600">
            {pickedDate.replaceAll('-', '.')}
          </span>
        </div>
      )}

      <section className="px-[14px] pb-8">
        <ul className="mt-2 divide-y divide-gray-100 rounded-2xl bg-white">
          {items.map((it) => (
            <li key={it.id}>
              <Link
                href="/coming-soon"
                className="flex items-center gap-3 px-2 py-3 active:opacity-90"
              >
                <Image
                  src={`/${STICKER_SRC[it.sticker]}`} alt=""
                  width={28} height={28} className="h-7 w-7 shrink-0" draggable={false}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] text-gray-800">{it.title}</p>
                  <p className="mt-0.5 text-[12px] text-gray-400">
                    {it.date.replaceAll('-', '.')}
                  </p>
                </div>
                <span aria-hidden className="rounded-full p-2 text-gray-400">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
          {!items.length && (
            <li className="px-4 py-10 text-center text-sm text-gray-400">
              {mode === 'event' ? '표시할 행사가 없어요.' : '표시할 일정이 없어요.'}
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}