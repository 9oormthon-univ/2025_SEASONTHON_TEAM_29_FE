// app/(main)/calendar/page.tsx
'use client';

import CalendarToggle from '@/components/calendar/CalendarToggle';
import CalSheet from '@/components/calendar/CalSheet';
import MonthSlider from '@/components/calendar/MonthSlider';
import SummaryCard from '@/components/calendar/SummaryCard';
import SvgObject from '@/components/common/atomic/SvgObject';
import Header from '@/components/common/monocules/Header';
import { useCalendarRange } from '@/hooks/useCalendarRange';
import { dday, toYMD } from '@/lib/calendar';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

type Mode = 'schedule' | 'event';

const WEDDING_YMD = '2025-12-31';

export default function CalendarPage() {
  const [base, setBase] = useState<Date>(new Date());
  const [activeYmd, setActiveYmd] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('schedule');

  const { maps } = useCalendarRange(
    base,
    mode === 'schedule' ? 'USER' : 'ADMIN',
  );

  const d = dday(WEDDING_YMD);
  const openDay = (date: Date) => setActiveYmd(toYMD(date));

  // 현재 달 기준 시트
  const sheetItems = useMemo(() => {
    if (!activeYmd) return [];
    const key = `${base.getFullYear()}-${base.getMonth() + 1}`;
    const sheetMap = maps[key]?.sheet ?? new Map();
    return (sheetMap.get(activeYmd) ?? []).map((x) => ({
      id: x.id,
      title: x.title,
      sticker: x.sticker,
    }));
  }, [activeYmd, base, maps]);

  const makeByDate = useCallback(
    (monthBase: Date) => {
      const key = `${monthBase.getFullYear()}-${monthBase.getMonth() + 1}`;
      return maps[key]?.grid ?? new Map();
    },
    [maps],
  );

  const router = useRouter();

  return (
    <main className="mx-auto w-full max-w-[420px] pb-[48px]">
      <Header
        showBack
        onBack={() => router.push('/home')}
        value={`${base.getMonth() + 1}월`}
        rightSlot={
          <CalendarToggle
            value={mode}
            onChange={(v) => setMode(v)}
            labels={{ event: '행사', schedule: '일정' }}
          />
        }
      />

      <section className="px-[22px] pt-2">
        <div className="flex items-center gap-2">
          <SvgObject src="/icons/MyRing.svg" width={32} height={37} />
          <p className="text-[18px] font-medium">
            결혼까지 <span className="text-primary-500">D-{d}</span>
          </p>
        </div>
        <p className="mt-1 !text-sm text-gray-500">
          끝까지 웨딧이 함께 할게요 :)
        </p>
        <div className="mt-4">
          <SummaryCard />
        </div>
      </section>

      <section className="mt-8 pb-8">
        <MonthSlider
          base={base}
          setBase={setBase}
          makeByDate={makeByDate}
          onPickDay={openDay}
          className="max-w-[360px] mx-auto"
        />
      </section>

      <CalSheet
        ymd={activeYmd}
        items={sheetItems}
        mode={mode}
        onClose={() => setActiveYmd(null)}
      />
    </main>
  );
}
