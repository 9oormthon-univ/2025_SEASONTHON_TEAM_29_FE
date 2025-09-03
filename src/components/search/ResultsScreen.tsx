'use client';

import SearchBar from '@/components/common/atomic/SearchBar';
import Header from '@/components/common/monocules/Header';
import { categories } from '@/data/homeData';
import type { CategoryKey } from '@/types/category';
import type { SearchItem } from '@/types/search';
import VendorCard from '../common/atomic/VendorCard';

export default function ResultsScreen({
  items,
  loading = false,
}: {
  items: SearchItem[];
  loading?: boolean;
}) {
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
      <Header value="검색결과" className="h-[50px]" />
      <SearchBar />

      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+12px)] space-y-6">
        {loading ? (
          // ✅ 로딩 중일 때는 skeleton만
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