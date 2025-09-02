// src/components/search/SearchPage.tsx
'use client';

import { CategoryKey } from '@/types/category';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Button from '../common/atomic/Button';
import Header from '../common/monocules/Header';
import CategoryRow from './CategoryRow';
import { ChipGroup, ChipSingle } from './Chips';
import PriceRange from './PriceRange';
import QueryInput from './QueryInput';

const STYLE = ['채플', '호텔', '컨벤션', '하우스'] as const;
const MEAL  = ['뷔페', '코스', '한상차림'] as const;
const GUEST = ['50명', '100명', '300명'] as const;
const TRANS = ['지하철', '버스', '자차'] as const;

export default function SearchPage({ initialCat = null as CategoryKey | null }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<CategoryKey | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [style, setStyle] = useState<string[]>([]);
  const [meal, setMeal] = useState<string[]>([]);
  const [guest, setGuest] = useState<string | null>(null);
  const [trans, setTrans] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  useEffect(() => { if (initialCat) setCat(initialCat); }, [initialCat]);

  const isHall = cat === 'hall';

  const canSearch = useMemo(() => {
    if (!isHall) return false; // ← hall만 검색 가능
    return (
      areas.length > 0 &&
      cat !== null
    );
  }, [isHall, areas, cat, price, style, meal, guest, trans]);

  const toggle = (list: string[], v: string, set: (v: string[]) => void) =>
    set(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);

  function goResults() {
    const p = new URLSearchParams();
    areas.forEach(a => p.append('region', a));
    if (cat) p.set('cat', cat);
    if (price !== null) p.set('price', String(price));
    style.forEach(v => p.append('style', v));
    meal.forEach(v  => p.append('meal', v));
    trans.forEach(v => p.append('trans', v));
    if (guest) p.set('guest', guest);
    router.push(`/search/results?${p.toString()}`);
  }

  return (
    <main className="mx-auto px-[22px] w-full max-w-[420px] h-dvh flex flex-col overflow-hidden">
      {/* 상단 고정 */}
      <Header value="검색" className="h-[50px]" />

      <section className="px-0">
        <QueryInput
          query={query}
          onQueryChange={setQuery}
          selected={areas}
          onSelectedChange={setAreas}
        />
      </section>

      <section className="mt-4 px-0">
        <CategoryRow value={cat} onChange={setCat} />
      </section>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-3 pb-[80px] overflow-scroll [&::-webkit-scrollbar]:hidden" 
      style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none',}}>
        {isHall ? (
          <>
            <PriceRange
              value={price ?? 10}
              selected={price !== null}
              onFirstPick={() => setPrice(10)}
              onChange={(v) => setPrice(v)}
            />

            <section className="mt-2">
              <h3 className="mb-3 text-[15px] font-extrabold text-gray-800">스타일</h3>
              <ChipGroup values={STYLE} selected={style} onToggle={(v)=>toggle(style, v, setStyle)} />
            </section>

            <section className="mt-2">
              <h3 className="mb-3 text-[15px] font-extrabold text-gray-800">식사</h3>
              <ChipGroup values={MEAL} selected={meal} onToggle={(v)=>toggle(meal, v, setMeal)} />
            </section>

            <section className="mt-2">
              <h3 className="mb-3 text-[15px] font-extrabold text-gray-800">하객 수</h3>
              <ChipSingle values={GUEST} value={guest} onChange={setGuest} />
            </section>

            <section className="mt-2 mb-4">
              <h3 className="mb-3 text-[15px] font-extrabold text-gray-800">교통 조건</h3>
              <ChipGroup values={TRANS} selected={trans} onToggle={(v)=>toggle(trans, v, setTrans)} />
            </section>
          </>
        ) : (
          // ❄️ 비어있는 상태
          <div className="flex flex-col items-center justify-center mt-12">
            <div className="rounded-2xl px-10">
              {/* 원하면 정식 일러스트 경로로 교체 */}
              <Image
                src="/lock.png"
                alt=""
                width={200}
                height={200}
                className="h-[200px] w-[200px] object-contain"
                onError={(e) => {
                  // 이미지 없을 때 간단한 플레이스홀더
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-lg pt-5 font-bold text-gray-500">곧 만나요!</p>
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed inset-x-0 bottom-0 z-10">
        <div className="mx-auto w-full max-w-[420px] bg-white px-[22px] pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
          <Button fullWidth size="lg" disabled={!canSearch} onClick={goResults}>
            검색하기
          </Button>
        </div>
      </div>
    </main>
  );
}