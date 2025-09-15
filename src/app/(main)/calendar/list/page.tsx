// app/(main)/calendar/list/page.tsx  (파일 경로는 기존과 동일하게 조정)
'use client';

import CalendarToggle from '@/components/calendar/CalendarToggle';
import { STICKER_SRC } from '@/components/calendar/stickers';
import Header from '@/components/common/monocules/Header';
import { useCalendarList } from '@/hooks/useCalendarList';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

type Mode = 'schedule' | 'event';

function monthBaseFromQS(qs: URLSearchParams) {
  const dFromQs = qs.get('base'); // yyyy-mm
  if (dFromQs) {
    const [y, m] = dFromQs.split('-').map((n) => parseInt(n, 10));
    if (y && m) return new Date(y, m - 1, 1);
  }
  return new Date();
}

export default function CalendarListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const qs = useSearchParams();

  const [mode, setMode] = useState<Mode>((qs.get('mode') as Mode) || 'schedule');
  const pickedDate = qs.get('date') || undefined; // YYYY-MM-DD
  const base = useMemo(() => monthBaseFromQS(qs), [qs]);

  const { rows, loading } = useCalendarList({
    year: base.getFullYear(),
    month: base.getMonth() + 1,
    type: mode === 'schedule' ? 'USER' : 'ADMIN',
    pickedDate,
  });

  const onChangeMode = (v: Mode) => {
    setMode(v);
    const params = new URLSearchParams(qs.toString());
    params.set('mode', v);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const title = mode === 'event' ? '행사 모아보기' : '일정 모아보기';

  return (
    <main className="mx-auto w-full max-w-[420px] pb-[24px]">
      <Header
        showBack
        onBack={() => router.back()}
        value={title}
        rightSlot={
          <CalendarToggle
            value={mode}
            onChange={onChangeMode}
            labels={{ event: '행사', schedule: '일정' }}
          />
        }
      />

      {pickedDate && (
        <div className="px-[22px] pt-2">
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-[12px] text-gray-600">
            {pickedDate.replaceAll('-', '.')}
          </span>
        </div>
      )}

      <section className="px-[14px] pb-8">
        <ul className="mt-2 divide-y divide-gray-100 rounded-2xl bg-white">
          {loading && (
            <li className="px-4 py-10 text-center text-sm text-gray-400">불러오는 중…</li>
          )}

          {!loading &&
            rows.map((it) => (
              <li key={it.id}>
                <Link href="/coming-soon" className="flex items-center gap-3 px-2 py-3 active:opacity-90">
                  <Image
                    src={STICKER_SRC[it.sticker]}  // ✅ 앞에 '/' 더 붙이지 마세요!
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0"
                    draggable={false}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] text-gray-800">{it.title}</p>
                    <p className="mt-0.5 text-[12px] text-gray-400">{it.date.replaceAll('-', '.')}</p>
                  </div>
                  <span aria-hidden className="rounded-full p-2 text-gray-400">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}

          {!loading && rows.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-gray-400">
              {mode === 'event' ? '표시할 행사가 없어요.' : '표시할 일정이 없어요.'}
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}