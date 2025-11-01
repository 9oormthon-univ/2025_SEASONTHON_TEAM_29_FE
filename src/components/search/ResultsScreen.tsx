'use client';

import Header from '@/components/common/monocules/Header';
import { categories } from '@/data/homeData';
import { resolveRegionName } from '@/lib/region';
import {
    dressOriginLabel,
    dressStyleLabel,
    hallMealLabel,
    hallStyleLabel,
    makeupStyleLabel,
    studioShotLabel,
    studioStyleLabel,
} from '@/services/mappers/searchMapper';
import type { CategoryKey } from '@/types/category';
import type { SearchItem } from '@/types/search';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import SvgObject from '../common/atomic/SvgObject';
import VendorCard from '../common/atomic/VendorCard';

export default function ResultsScreen({
  items,
  loading = false,
  onLoadMore,
  isFetchingMore,
}: {
  items: SearchItem[];
  loading?: boolean;
  onLoadMore?: () => void;
  isFetchingMore?: boolean;
}) {
  const sp = useSearchParams();
  const router = useRouter();

  // ✅ 현재 카테고리
  const cat = sp.get('cat') as CategoryKey | null;
  
  // ✅ 지도에서 선택된 매장인지 확인
  const isFromMap = sp.has('vendorId') && sp.has('lat') && sp.has('lng');
  const selectedStoreName = sp.get('storeName');

  // ✅ chips 생성 로직
  const chips = useMemo(() => {
    const out: string[] = [];

    // 지역 → 마지막 단어만
    sp.getAll('region').forEach((code) => {
      const name = resolveRegionName(code);
      if (name) {
        const short = name.split(' ').slice(-1)[0];
        out.push(short);
      }
    });

    // 가격 (원 → 만원 변환)
    const price = sp.get('price');
    if (price) {
      const num = Number(price);
      if (!isNaN(num)) out.push(`${num / 10000}만원`);
    }

    // 웨딩홀
    sp.getAll('hallStyle').forEach((v) => out.push(hallStyleLabel[v] ?? v));
    sp.getAll('hallMeal').forEach((v) => out.push(hallMealLabel[v] ?? v));
    const guest = sp.get('guest');
    if (guest) out.push(`${guest}명`);
    if (sp.get('parking') === 'true') out.push('주차');

    // 드레스
    sp.getAll('dressStyle').forEach((v) => out.push(dressStyleLabel[v] ?? v));
    sp.getAll('dressOrigin').forEach((v) => out.push(dressOriginLabel[v] ?? v));

    // 스튜디오
    sp.getAll('studioStyle').forEach((v) => out.push(studioStyleLabel[v] ?? v));
    sp.getAll('specialShots').forEach((v) => out.push(studioShotLabel[v] ?? v));
    if (sp.get('iphoneSnap') === 'true') out.push('아이폰 스냅');

    // 메이크업
    sp.getAll('makeupStyle').forEach((v) => out.push(makeupStyleLabel[v] ?? v));
    if (sp.get('stylist') === 'true') out.push('담당지정');
    if (sp.get('room') === 'true') out.push('단독룸');

    return out;
  }, [sp]);

  const grouped = useMemo(() => {
    return items.reduce((acc, it) => {
      const list = (acc[it.cat] ??= []);
      list.push(it);
  
      // 업체 단위로 가격 최소값 계산
      if (it.price) {
        list.minPrice = Math.min(list.minPrice ?? Infinity, it.price);
      }
  
      return acc;
    }, {} as Partial<Record<CategoryKey, (SearchItem[] & { minPrice?: number })>>);
  }, [items]);

  return (
    <main
      className="mx-auto w-full max-w-[420px] h-dvh flex flex-col overflow-hidden"
      data-hide-bottombar
    >
      <Header
        showBack
        onBack={() => {
          router.back();
        }}
        value="검색결과"
      />
        <div className="px-[22px] flex-1 overflow-y-auto">

        {/* ✅ 지도에서 선택된 매장 알림 */}
        {isFromMap && selectedStoreName && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <SvgObject src="/icons/map.svg" className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                지도에서 선택한 매장: <span className="font-bold">{selectedStoreName}</span>
              </span>
            </div>
          </div>
        )}

        {/* ✅ Chips: 가로 스크롤 */}
        <div className="-mx-[6px] px-[6px] mb-2">
          <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide">
            {chips.map((c, i) => (
              <span
                key={`chip-${i}`}
                className="shrink-0 rounded-full border border-primary-400 bg-primary-200 px-3 py-1 text-[13px] font-medium text-text-default"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* 결과 */}
        <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+12px)] space-y-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-5 w-28 bg-gray-200 rounded" />
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>
            
            
          ) : (
            <>
              {categories.map(({ key, label }) => {
                const list = grouped[key] ?? [];
                if (!list.length) return null;

                return (
                  <section key={key} className="px-1 pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-[16px] font-bold text-gray-900">
                        {label}
                      </h2>
                      {cat === key && (
                        <button
                          onClick={() => {
                            const cat = sp.get('cat');
                            router.push(`/search/filters?cat=${cat}`);
                          }}
                          className="text-text-secondary hover:text-gray-600 flex"
                        >
                          <SvgObject src='/icons/redo.svg' className='pr-1.5 w-5.5'/>
                          <span className='text-sm'>다시 설정</span>
                          
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-x-3 gap-y-6 pt-4">
                      {list.map((it) => (
                        <VendorCard
                          key={it.id}
                          item={{
                            vendorId: it.id,
                            vendorName: it.name,
                            logoImageUrl: it.logo,
                            regionName: it.region,
                            averageRating: it.rating,
                            reviewCount: it.count,
                            minPrice: grouped[key]?.minPrice,
                          }}
                          href={`/vendor/${it.id}`}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}

              {!items.length && (
                <div className="py-20 text-center text-sm text-gray-500">
                  조건에 맞는 결과가 없어요.
                </div>
              )}

              {onLoadMore && (
                <div className="text-center py-4">
                  <button
                    onClick={onLoadMore}
                    disabled={isFetchingMore}
                    className="px-4 py-2 rounded bg-primary-500 text-white"
                  >
                    {isFetchingMore ? '불러오는 중...' : '더보기'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}