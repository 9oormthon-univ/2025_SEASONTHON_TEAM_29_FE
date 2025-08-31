// src/app/(main)/search/page.tsx
'use client';

import Header from '@/components/common/monocules/Header';
import { categories } from "@/data/homeData";
import { CategoryKey } from '@/types/category';
import Image from 'next/image';
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
    <main className="w-full max-w-[420px] pb-[calc(env(safe-area-inset-bottom)+100px)]">
      <Header value="검색" className='h-[70px]'/>

      <div className="px-4 pt-4">
        <h1 className="text-2xl font-extrabold leading-snug">
          검색할 카테고리를{'\n'}선택해 주세요.
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
                <span className="relative h-14 w-14">
                  <Image src={c.icon} alt={c.label} fill className="object-contain" />
                </span>
                <span className="mt-2 text-[15px] font-semibold text-gray-800">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed inset-x-0 bottom-0 z-20 bg-white/80 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur">
        <button
          disabled={!selected}
          onClick={goNext}
          className={`mx-auto block h-[54px] w-full max-w-[420px] rounded-xl text-md font-extrabold
            ${selected ? 'bg-primary-500 text-white' : 'bg-primary-500/10 text-primary-500/40'}`}
        >
          검색하기
        </button>
      </div>
    </main>
  );
}