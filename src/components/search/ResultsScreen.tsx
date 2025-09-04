// src/components/search/ResultsScreen.tsx
'use client';

import Header from '@/components/common/monocules/Header';
import { categories } from '@/data/homeData';
import type { CategoryKey } from '@/types/category';
import type { SearchItem } from '@/types/search';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import VendorCard from '../common/atomic/VendorCard';

export default function ResultsScreen({
  items,
  loading = false,
}: {
  items: SearchItem[];
  loading?: boolean;
}) {
  const sp = useSearchParams();
  const router = useRouter();

  // 칩스 만들기: URL 쿼리에서 표기용 텍스트만 추출
  const chips = useMemo(() => {
    const out: string[] = [];

    // 다중값
    for (const k of ['region', 'style', 'meal']) {
      sp.getAll(k).forEach((v) => v && out.push(v));
    }
    // 단일값
    const guest = sp.get('guest');
    const price = sp.get('price'); // 만원 단위
    if (guest) out.push(guest);
    if (price) out.push(`${price}만원`);
    // 기타(필요 시 확장)
    return out;
  }, [sp]);

  // 카테고리별 묶기
  const grouped = items.reduce((acc, it) => {
    (acc[it.cat] ??= []).push(it);
    return acc;
  }, {} as Partial<Record<CategoryKey, SearchItem[]>>);

  return (
    <main
      className="mx-auto w-full max-w-[420px] px-[22px] h-dvh flex flex-col overflow-hidden"
      data-hide-bottombar
    >
      <Header value="검색결과" />

      {/* 선택 칩스 */}
      <div className="mb-2 -mx-[6px] flex flex-wrap gap-2 px-[6px]">
        {chips.map((c, i) => (
          <span
            key={`${c}-${i}`}
            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[13px] font-medium text-rose-400"
          >
            {c}
          </span>
        ))}
        {/* 다시 설정 */}
        <button
          type="button"
          onClick={() => router.push('/search/filters' + (sp.toString() ? `?${sp.toString()}` : ''))}
          className="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] text-gray-400 hover:text-gray-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 6v3l4-4-4-4v3C6.48 4 2 8.48 2 14a8 8 0 0 0 14.9 3h-2.3A6 6 0 1 1 12 6z" fill="currentColor"/>
          </svg>
          다시 설정
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+12px)] space-y-6">
        {loading ? (
          // skeleton
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
                <section key={key}>
                  <h2 className="mb-3 px-1 text-[15px] font-extrabold text-gray-900">
                    {label}
                  </h2>
                  <div className="grid grid-cols-3">
                    {list.map((it) => (
                      <VendorCard
                        key={it.id}
                        item={{
                          id: it.id,
                          name: it.name,
                          region: it.region,
                          logo: it.logo,
                          rating: it.rating,
                          count: it.count,
                          price: it.price,
                        }}
                        href={`/vendor/${it.cat}/${it.id}`}
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
          </>
        )}
      </div>
    </main>
  );
}