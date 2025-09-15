'use client';

import Image from 'next/image';
import React, { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import Button from '@/components/common/atomic/Button';
import Header from '@/components/common/monocules/Header';

const PER_PAGE = 9;
const TOTAL = 27;
const PAGES = Math.ceil(TOTAL / PER_PAGE);

type Slot = { file: File | null; url: string | null };

export default function Page() {
  const [slots, setSlots] = useState<Slot[]>(
    Array.from({ length: TOTAL }, () => ({ file: null, url: null })),
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingIndex = useRef<number | null>(null);

  const pages = useMemo(() => Array.from({ length: PAGES }, (_, i) => i), []);

  const handlePick = (idx: number) => {
    pendingIndex.current = idx;
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    const idx = pendingIndex.current;
    if (!f || idx == null) return;

    const next = [...slots];
    const prevUrl = next[idx].url;
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    next[idx] = { file: f, url: URL.createObjectURL(f) };
    setSlots(next);

    pendingIndex.current = null;
    e.currentTarget.value = '';
  };
  function staggeredIndices(start: number, count = 9, pageIndex: number) {
    const ids = Array.from({ length: count }, (_, i) => start + i);
    const [a, b, c, d, e, f, g, h, i] = ids;

    // 왼-오-왼
    const patternA = [a, b, c, null, null, d, e, f, g, h, i, null];

    //  오-왼-오
    const patternB = [null, a, b, c, d, e, f, null, null, g, h, i];

    return (pageIndex % 2 === 0 ? patternA : patternB).slice(0, 12) as Array<
      number | null
    >;
  }

  return (
    <main className="relative mx-auto flex max-w-[420px] flex-col h-[100svh] bg-white">
      <Header
        value="청첩장 제작"
        showBack
        onBack={() => history.back()}
        rightSlot={
          <a href="#" className="text-xs text-primary-500 underline">
            미리보기
          </a>
        }
      />
      <div className="px-6 pt-6">
        <p className="text-sm font-medium text-text--default">
          실제 청첩장에 들어갈 형태에요
        </p>
        <h2 className="mt-1 text-xl font-bold text-text--default">
          사진을 추가해 주세요.
        </h2>
      </div>
      <div className="mt-25">
        <div className="flex snap-x snap-mandatory overflow-x-auto scroll-pl-6 gap-6 px-6 pb-2">
          {pages.map((p) => {
            const start = p * PER_PAGE;
            const end = Math.min(start + PER_PAGE, TOTAL);
            const indices = staggeredIndices(start, end - start, p);

            return (
              <section
                key={p}
                className="snap-start shrink-0 w-[calc(100vw-48px)] max-w-[372px]"
                aria-label={`page-${p + 1}`}
              >
                <div className="grid grid-cols-4 gap-2">
                  {indices.map((idx, k) =>
                    idx === null ? (
                      <div key={`empty-${k}`} />
                    ) : (
                      <div key={idx} className="relative">
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePick(idx)}
                          className={clsx(
                            'relative w-full overflow-hidden',
                            'outline-1 outline-box-line bg-box-line',
                            'aspect-[3/4]',
                          )}
                        >
                          {!slots[idx]?.url && (
                            <span className="absolute inset-0 grid place-items-center text-xl font-bold text-text--secondary">
                              {idx + 1}
                            </span>
                          )}
                          {slots[idx]?.url && (
                            <Image
                              src={slots[idx].url!}
                              alt={`${idx + 1}번 이미지`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-text--secondary">
        좌우로 움직이면 더 많은 사진을 넣을 수 있어요.
      </p>
      <div className="mt-auto px-6 pb-15 pt-4">
        <Button
          onClick={() => {
            const count = slots.filter((s) => s.file).length;
            alert(`${count}장의 사진이 선택되었습니다.`);
          }}
          fullWidth
        >
          등록하기
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </main>
  );
}
