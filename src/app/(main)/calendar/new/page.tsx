'use client';

import { STICKER_SRC } from '@/components/calendar/stickers';
import Input from '@/components/common/atomic/Input';
import TextField from '@/components/common/atomic/TextField';
import Header from '@/components/common/monocules/Header';
import { createCalendarEvent } from '@/services/calendar.api';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

type StickerKey = keyof typeof STICKER_SRC;

const ICON_CFG: Record<
  StickerKey,
  { w: number; h: number; className?: string }
> = {
  INVITATION: {
    w: 60,
    h: 62,
  },
  STUDIO: { w: 50, h: 46 },
  WEDDING_HALL: { w: 46, h: 46, className: 'translate-y-0.5' },
  DRESS: { w: 40, h: 50 },
  PARTY: { w: 51, h: 61 },
  BRIDAL_SHOWER: { w: 61, h: 61 },
  MAKEUP: { w: 33, h: 47 },
};

export default function CalendarNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('');
  const [titleStarted, setTitleStarted] = useState(false);
  const [memo, setMemo] = useState('');
  const [sticker, setSticker] = useState<StickerKey | null>(null);
  const [loading, setLoading] = useState(false);

  const disabled = !title.trim() || !sticker;

    // ?date=2025-09-18 이런 형태로 들어온 값 읽기
    const dateParam = searchParams.get('date');
    // 없으면 오늘 날짜
    const targetDate = dateParam ? new Date(dateParam) : new Date();
  
    // ISO string (자정 기준 allDay 이벤트)
    const startDateTime = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      23, 0, 0, 0,
    ).toISOString();
  
    const endDateTime = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      23, 59, 59, 999,
    ).toISOString();

  const stickers: StickerKey[] = useMemo(
    () => [
      'INVITATION',
      'STUDIO',
      'WEDDING_HALL',
      'DRESS',
      'PARTY',
      'BRIDAL_SHOWER',
      'MAKEUP',
    ],
    [],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !sticker) return;
    try {
      setLoading(true);
      await createCalendarEvent({
        title,
        description: memo,
        eventCategory: sticker.toUpperCase(),
        startDateTime,
        endDateTime,
        isAllDay: true,
      });
      router.back();
    } catch (err) {
      console.error('캘린더 등록 실패', err);
      alert('일정 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[420px]">
      <Header
        showBack
        onBack={() => router.push('/calendar')}
        value="일정 등록하기"
      />
      <form onSubmit={onSubmit} className="px-[22px] pb-8">
        <Input
          type={titleStarted ? 'defaultStrong' : 'default'}
          inputType="text"
          value={title}
          onChange={(e) => {
            const v = e.currentTarget.value;
            setTitle(v);
            if (!titleStarted && v.length > 0) setTitleStarted(true);
          }}
          placeholder="오늘은 무엇을 하는 날인가요?"
          className="mt-2 w-full"
          fullWidth
        />
        <TextField
          value={memo}
          onChange={setMemo}
          placeholder="기억하고 싶은 내용을 적어주세요."
          className="mt-3 w-full"
          textareaClassName="!text-[14px]"
          showCount
        />
        <div className="mt-5 grid grid-cols-4 gap-2">
          {stickers.map((key) => {
            const active = sticker === key;
            const { w, h, className } = ICON_CFG[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSticker(key)}
                aria-pressed={active}
                aria-label={key}
                className={clsx(
                  'relative h-20 w-20 rounded-xl border bg-white transition',
                  active
                    ? 'border-primary-400 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:bg-gray-50 active:scale-[0.98]',
                )}
              >
                <span className="absolute inset-0 grid place-items-center">
                  <Image
                    src={STICKER_SRC[key]}
                    alt={key}
                    width={40}
                    height={40}
                    draggable={false}
                    className="block w-15 h-15 object-contain"
                  />
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="submit"
          disabled={disabled || loading}
          className={clsx(
            'mt-50 h-12 w-full rounded-2xl text-[15px] font-semibold transition',
            disabled || loading
              ? 'bg-primary-200 text-primary-300 cursor-not-allowed'
              : 'bg-primary-500 text-white active:scale-[0.98]',
          )}
        >
          {loading ? '등록 중…' : '등록하기'}
        </button>
      </form>
    </main>
  );
}
