// app/(main)/calendar/new/page.tsx
'use client';

import { STICKER_SRC } from '@/components/calendar/stickers';
import Header from '@/components/common/monocules/Header';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

type StickerKey = keyof typeof STICKER_SRC;

export default function CalendarNewPage() {
  const router = useRouter();
  const qs = useSearchParams();
  const pickedDate = qs.get('date') ?? ''; // yyyy-mm-dd (있으면 표시 용도)

  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [sticker, setSticker] = useState<StickerKey | null>(null);

  const memoMax = 500;
  const disabled = !title.trim() || !sticker;

  const stickers: StickerKey[] = useMemo(
    () => ['letter', 'studio', 'hall', 'dress', 'drink', 'cake', 'makeup'],
    []
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    router.back();
  };

  return (
    <main className="mx-auto w-full max-w-[420px]">
      <Header value="일정 등록하기" />
      <form onSubmit={onSubmit} className="px-[22px] pb-8">
        {pickedDate && (
          <p className="mt-3 mb-1 text-[12px] text-text-secondary">
            선택한 날짜: <span className="font-medium text-foreground">{pickedDate}</span>
          </p>
        )}

        {/* 제목 */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="오늘은 무엇을 하는 날인가요?"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3
                     text-[14px] placeholder:text-gray-400 focus:outline-none focus:ring-2
                     focus:ring-primary-300/60"
          maxLength={80}
        />

        {/* 메모 */}
        <div className="relative mt-3">
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value.slice(0, memoMax))}
            placeholder="기억하고 싶은 내용을 적어주세요."
            rows={5}
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3
                       text-[14px] placeholder:text-gray-400 focus:outline-none focus:ring-2
                       focus:ring-primary-300/60"
          />
          <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-gray-300">
            {memo.length}/{memoMax}
          </span>
        </div>

        {/* 스티커 선택 */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {stickers.map((key) => {
            const active = sticker === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSticker(key)}
                className={clsx(
                  'h-18 w-18 rounded-xl border bg-white transition',
                  active
                    ? 'border-primary-400 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:bg-gray-50 active:scale-[0.98]'
                )}
                aria-pressed={active}
              >
                {/* 이미지 크기는 디자인에 맞춰 48px 정도 */}
                <Image
                  src={`/${STICKER_SRC[key]}`}
                  alt={key}
                  width={35}
                  height={35}
                  className="mx-auto"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={disabled}
          className={clsx(
            'mt-8 h-12 w-full rounded-2xl text-[15px] font-semibold transition',
            disabled
              ? 'bg-primary-200 text-rose-300 cursor-not-allowed'
              : 'bg-primary-500 text-white active:scale-[0.98]'
          )}
        >
          등록하기
        </button>
      </form>
    </main>
  );
}