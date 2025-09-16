// src/components/search/SearchPage.tsx
'use client';

import { resolveRegionCode } from '@/lib/region';
import {
  dressOriginMap, dressStyleMap, hallMealMap, hallStyleMap, makeupStyleMap,
  studioShotMap, studioStyleMap,
} from '@/services/mappers/searchMapper';
import { CategoryKey } from '@/types/category';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import Button from '../common/atomic/Button';
import Header from '../common/monocules/Header';
import CategoryRow from './CategoryRow';
import { ChipGroup, ChipSingle } from './Chips';
import PriceRange from './PriceRange';
import QueryInput from './QueryInput';
export default function SearchPage({ initialCat = null as CategoryKey | null }) {
  const router = useRouter();

  // 공통 상태
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<CategoryKey | null>(initialCat);
  const [price, setPrice] = useState<number | null>(null);
  const [areas, setAreas] = useState<string[]>([]);

  // 웨딩홀
  const [hallStyle, setHallStyle] = useState<string[]>([]);
  const [hallMeal, setHallMeal] = useState<string[]>([]);
  const [guest, setGuest] = useState<string | null>(null);
  const [parking, setParking] = useState<string | null>(null);

  // 드레스
  const [dressStyle, setDressStyle] = useState<string[]>([]);
  const [dressOrigin, setDressOrigin] = useState<string[]>([]);

  // 스튜디오
  const [studioStyle, setStudioStyle] = useState<string[]>([]);
  const [studioShot, setStudioShot] = useState<string[]>([]);
  const [iphoneSnap, setIphoneSnap] = useState<string | null>(null);

  // 메이크업
  const [makeupStyle, setMakeupStyle] = useState<string[]>([]);
  const [stylist, setStylist] = useState<string | null>(null);
  const [room, setRoom] = useState<string | null>(null);

  const canSearch = useMemo(() => {
    if (!cat) return false; // 카테고리만 있어도 가능
    return true;
  }, [cat]);

  const toggle = (list: string[], v: string, set: (v: string[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  /** 검색 실행 */
  function goResults() {
    const p = new URLSearchParams();

    // 지역
    areas.forEach((a) => {
      const code = resolveRegionCode(a);
      if (code) p.append('region', String(code));
    });

    // 공통
    if (cat) p.set('cat', cat);
    if (price !== null) p.set('price', String(price * 10000));

    // 웨딩홀
    hallStyle.forEach((v) => p.append('hallStyle', hallStyleMap[v]));
    hallMeal.forEach((v) => p.append('hallMeal', hallMealMap[v]));
    if (guest) p.set('guest', guest.replace(/명$/, ''));
    if (parking === '있음') {
      p.set('hasParking', 'true');
    } else if (parking === '없음') {
      p.set('hasParking', 'false');
    }

    // 드레스
    dressStyle.forEach((v) => p.append('dressStyle', dressStyleMap[v]));
    dressOrigin.forEach((v) => p.append('dressOrigin', dressOriginMap[v]));

    // 스튜디오
    studioStyle.forEach((v) => p.append('studioStyle', studioStyleMap[v]));

    // 선택된 특수촬영만 추가
    if (studioShot.length > 0) {
      studioShot.forEach((v) => p.append('specialShots', studioShotMap[v]));
    }
    
    // 아이폰 스냅
    if (iphoneSnap) p.set('iphoneSnap', iphoneSnap === '있음' ? 'true' : 'false');

    // 메이크업
    makeupStyle.forEach((v) => p.append('makeupStyle', makeupStyleMap[v]));
    if (stylist) p.set('stylist', stylist === '가능' ? 'true' : 'false');
    if (room) p.set('room', room === '있음' ? 'true' : 'false');

    router.push(`/search/results?${p.toString()}`);
  }

  return (
    <main className="mx-auto w-full max-w-[420px] h-dvh flex flex-col overflow-hidden">
      <Header showBack onBack={() => router.push('/search')} value="검색" />
      <div className="px-[22px] flex-1 overflow-y-auto">

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

        <div className="flex-1 overflow-y-auto px-3 pb-[80px] overflow-scroll [&::-webkit-scrollbar]:hidden">
          {/* 웨딩홀 */}
          {cat === 'hall' && (
            <>
              <PriceRange value={price ?? 10} selected={price !== null} onFirstPick={() => setPrice(10)} onChange={setPrice} />
              <section className="mt-2">
                <h3 className="mb-3 font-bold text-gray-800">스타일</h3>
                <ChipGroup values={['호텔', '컨벤션', '하우스']} selected={hallStyle} onToggle={(v) => toggle(hallStyle, v, setHallStyle)} />
              </section>
              <section className="mt-2">
                <h3 className="mb-3 font-bold text-gray-800">식사</h3>
                <ChipGroup values={['뷔페', '코스', '세미코스']} selected={hallMeal} onToggle={(v) => toggle(hallMeal, v, setHallMeal)} />
              </section>
              <section className="mt-2">
                <h3 className="mb-3 font-bold text-gray-800">하객 수</h3>
                <ChipSingle values={['50명', '100명', '300명']} value={guest} onChange={setGuest} />
              </section>
              <section className="mt-2 mb-4">
                <h3 className="mb-3 font-bold text-gray-800">주차장</h3>
                <ChipSingle values={['있음', '없음']} value={parking} onChange={setParking} />
              </section>
            </>
          )}

          {/* 드레스 */}
          {cat === 'dress' && (
            <>
              <PriceRange value={price ?? 10} selected={price !== null} onFirstPick={() => setPrice(10)} onChange={setPrice} />
              <section className="mt-2">
                <h3 className="mb-3 font-bold text-gray-800">주력스타일</h3>
                <ChipGroup values={['모던', '클래식', '로맨틱', '단아', '유니크', '하이엔드']} selected={dressStyle} onToggle={(v) => toggle(dressStyle, v, setDressStyle)} />
              </section>
              <section className="mt-2 mb-4">
                <h3 className="mb-3 font-bold text-gray-800">제작사</h3>
                <ChipGroup values={['국내', '수입']} selected={dressOrigin} onToggle={(v) => toggle(dressOrigin, v, setDressOrigin)} />
              </section>
            </>
          )}

          {/* 스튜디오 */}
          {cat === 'studio' && (
            <>
              <PriceRange value={price ?? 10} selected={price !== null} onFirstPick={() => setPrice(10)} onChange={setPrice} />
              <section className="mt-2">
                <h3 className="mb-3 font-bold text-gray-800">스타일</h3>
                <ChipGroup values={['인물중심', '자연', '감성', '클래식', '흑백']} selected={studioStyle} onToggle={(v) => toggle(studioStyle, v, setStudioStyle)} />
              </section>
              <section className="mt-2">
                <h3 className="mb-3 font-bold text-gray-800">특수촬영</h3>
                <ChipGroup values={['한옥', '수중', '반려동물']} selected={studioShot} onToggle={(v) => toggle(studioShot, v, setStudioShot)} />
              </section>
              <section className="mt-2 mb-4">
                <h3 className="mb-3 font-bold text-gray-800">아이폰 스냅</h3>
                <ChipSingle values={['있음', '없음']} value={iphoneSnap} onChange={setIphoneSnap} />
              </section>
            </>
          )}

          {/* 메이크업 */}
          {cat === 'makeup' && (
            <>
              <PriceRange value={price ?? 10} selected={price !== null} onFirstPick={() => setPrice(10)} onChange={setPrice} />
              <section className="mt-2">
                <h3 className="mb-3 font-bold text-gray-800">스타일</h3>
                <ChipGroup values={['청순', '로맨틱', '내추럴', '글램']} selected={makeupStyle} onToggle={(v) => toggle(makeupStyle, v, setMakeupStyle)} />
              </section>
              <section className="mt-2">
                <h3 className="mb-3 font-bold text-gray-800">담당지정</h3>
                <ChipSingle values={['가능', '불가능']} value={stylist} onChange={setStylist} />
              </section>
              <section className="mt-2 mb-4">
                <h3 className="mb-3 font-bold text-gray-800">단독룸</h3>
                <ChipSingle values={['있음', '없음']} value={room} onChange={setRoom} />
              </section>
            </>
          )}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-10">
          <div className="mx-auto w-full max-w-[420px] bg-white px-[22px] pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
            <Button fullWidth size="lg" disabled={!canSearch} onClick={goResults}>
              검색하기
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
