// app/(main)/calendar/page.tsx
'use client';

import CalendarToggle from '@/components/calendar/CalendarToggle';
import CalSheet from '@/components/calendar/CalSheet';
import MonthSlider from '@/components/calendar/MonthSlider';
import SummaryCard from '@/components/calendar/SummaryCard';
import SvgObject from '@/components/common/atomic/SvgObject';
import Header from '@/components/common/monocules/Header';
import { MOCK_EVENTS, MOCK_WEDDING_DATE, expandFairsToDays } from '@/data/calendarData';
import { addMonths, dday, toYMD } from '@/lib/calendar';
import { EventItem } from '@/types/calendar';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

type Mode = 'schedule' | 'event';

export default function CalendarPage() {
  const [base, setBase] = useState<Date>(new Date());
  const [activeYmd, setActiveYmd] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('schedule'); // ✅ 토글 상태

  const d = dday(MOCK_WEDDING_DATE);
  const openDay = (date: Date) => setActiveYmd(toYMD(date));

  // 개인 일정 → 전역에서 그대로 묶기
  const scheduleMapAll = useMemo(() => {
    const m = new Map<string, EventItem[]>();
    for (const ev of MOCK_EVENTS) {
      const arr = m.get(ev.date) ?? [];
      arr.push({ id: ev.id, date: ev.date, sticker: ev.sticker });
      m.set(ev.date, arr);
    }
    return m;
  }, []);

  // ✅ “해당 monthBase 기준”으로 맵을 만들어 주는 팩토리
  const makeByDate = useCallback(
    (monthBase: Date) => {
      if (mode === 'schedule') return scheduleMapAll;
      // event 모드: 매 달마다 다시 펼쳐서 맵 생성
      const items = expandFairsToDays(monthBase); // sticker: 'hall'
      const m = new Map<string, EventItem[]>();
      for (const it of items) {
        const arr = m.get(it.date) ?? [];
        arr.push(it);
        m.set(it.date, arr);
      }
      return m;
    },
    [mode, scheduleMapAll],
  );

  const sheetItems = useMemo(() => {
    if (!activeYmd) return [];
    if (mode === 'schedule') {
      return MOCK_EVENTS
        .filter((e) => e.date === activeYmd)
        .map((e) => ({ id: e.id, title: e.title, sticker: e.sticker }));
    }
    // 행사 모드
    return expandFairsToDays(base)
      .filter((e) => e.date === activeYmd)
      .map((e) => ({ id: e.id, title: e.title, sticker: e.sticker })); // expandFairsToDays가 title 반환하도록 위에서 수정함
  }, [activeYmd, mode, base]);
  const router = useRouter();

  return (
    <main className="mx-auto w-full max-w-[420px]">
      <Header
        showBack
        onBack={()=>{()=>router.back()}}
        value={`${base.getMonth() + 1}월`}
        rightSlot={
          <CalendarToggle
            value={mode}
            onChange={(v) => setMode(v)}
            labels={{ event: '행사', schedule: '일정' }}
          />
        }
      />

      {/* D-Day + 카드 */}
      <section className="px-[22px] pt-2">
        <div className="flex items-center gap-2">
          <SvgObject src="/icons/PinkRing.svg" />
          <p className="text-[18px] font-semibold">
            결혼까지 <span className="text-primary-500">D-{d}</span>
          </p>
        </div>
        <p className="mt-1 text-sm text-gray-500">끝까지 웨딧이 함께 할게요 :)</p>

        <div className="mt-4">
          <SummaryCard />
        </div>
      </section>

      {/* 월 헤더 + 요일 헤더 */}
      <section className="mt-3 px-[14px] max-w-[360px] mx-auto">
        <MonthHeader
          base={base}
          onPrev={() => setBase((b) => addMonths(b, -1))}
          onNext={() => setBase((b) => addMonths(b, +1))}
          className="mb-2"
        />
        <WeekHeader />
      </section>

      <section className="mt-2 pb-8">
        <MonthSlider
          base={base}
          setBase={setBase}
          makeByDate={makeByDate}   // ✅ 변경된 부분
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

function MonthHeader({
  base,
  onPrev,
  onNext,
  className,
}: {
  base: Date;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}) {
  const label = `${base.getFullYear()}년 ${base.getMonth() + 1}월`;
  return (
    <div className={clsx('flex items-center justify-between text-gray-800', className)}>
      <button
        type="button"
        aria-label="이전 달"
        onClick={onPrev}
        className="rounded-full p-2 text-gray-500 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60"
      >
        ‹
      </button>
      <p className="text-sm font-semibold">{label}</p>
      <button
        type="button"
        aria-label="다음 달"
        onClick={onNext}
        className="rounded-full p-2 text-gray-500 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60"
      >
        ›
      </button>
    </div>
  );
}

function WeekHeader() {
  const labels = ['일', '월', '화', '수', '목', '금', '토'];
  return (
    <div className="grid grid-cols-7 text-center text-[12px] leading-[14px]">
      {labels.map((d, i) => (
        <div key={d} className={i === 0 ? 'font-medium text-[#FF6B6B]' : 'font-medium text-text-secondary'}>
          {d}
        </div>
      ))}
    </div>
  );
}