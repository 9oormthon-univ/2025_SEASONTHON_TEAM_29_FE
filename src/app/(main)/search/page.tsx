// src/app/(main)/search/page.tsx
'use client';

import Button from '@/components/common/atomic/Button';
import SvgObject from '@/components/common/atomic/SvgObject';
import Header from '@/components/common/monocules/Header';
import { categories } from "@/data/homeData";
import { CategoryKey } from '@/types/category';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CategorySelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<CategoryKey | null>('hall'); // 기본값 원한다면 'hall'

  const goNext = () => {
    if (!selected) return;
    router.push(`/search/filters?cat=${selected}`);
  };

  return (
    <main className="w-full max-w-[420px] mx-auto px-[22px]">
      <Header value="검색" className="h-[50px]" />

      <div className="pt-3">
        <h1 className="text-head-2 font-extrabold">
          검색할 카테고리를<br/>선택해 주세요.
        </h1>

        <div className="mt-5 grid grid-cols-2 gap-4">
          {categories.map((c) => {
            const active = selected === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelected(c.key)}
                className={[
                  'flex aspect-square flex-col items-center justify-center rounded-2xl border bg-white transition',
                  active ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-gray-200',
                ].join(' ')}
              >
                <div className="h-14 w-14">
                  <SvgObject src={c.icon} alt={c.label} className="h-full w-full" />
                </div>
                <span className="mt-2 text-[15px] font-semibold text-gray-800">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-10">
        <div className="mx-auto w-full max-w-[420px] bg-white px-[22px] pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
          <Button fullWidth size="lg" disabled={!selected} onClick={goNext}>
            다음
          </Button>
        </div>
      </div>
    </main>
  );
}