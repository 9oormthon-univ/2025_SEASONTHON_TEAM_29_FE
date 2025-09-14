// app/(main)/calendar/new/page.tsx
'use client';

import { STICKER_SRC } from '@/components/calendar/stickers';
import Header from '@/components/common/monocules/Header';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import Input from '@/components/common/atomic/Input';
import TextField from '@/components/common/atomic/TextField';

type StickerKey = keyof typeof STICKER_SRC;

export default function CalendarNewPage() {
  const router = useRouter();
  const qs = useSearchParams();
  const pickedDate = qs.get('date') ?? '';

  const [title, setTitle] = useState('');
  const [titleStarted, setTitleStarted] = useState(false);
  const [memo, setMemo] = useState('');
  const [sticker, setSticker] = useState<StickerKey | null>(null);

  const disabled = !title.trim() || !sticker;

  const stickers: StickerKey[] = useMemo(
    () => ['letter', 'studio', 'hall', 'dress', 'drink', 'cake', 'makeup'],
    [],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    router.back();
  };

  return (
    <main className="mx-auto w-full max-w-[420px]">
      <Header showBack onBack={() => router.back()} value="일정 등록하기" />

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
          textareaClassName="text-[14px]"
          showCount
        />
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
                    : 'border-gray-200 hover:bg-gray-50 active:scale-[0.98]',
                )}
                aria-pressed={active}
              >
                <Image
                  src={STICKER_SRC[key]}
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
        <button
          type="submit"
          disabled={disabled}
          className={clsx(
            'mt-8 h-12 w-full rounded-2xl text-[15px] font-semibold transition',
            disabled
              ? 'bg-primary-200 text-rose-300 cursor-not-allowed'
              : 'bg-primary-500 text-white active:scale-[0.98]',
          )}
        >
          등록하기
        </button>
      </form>
    </main>
  );
}
