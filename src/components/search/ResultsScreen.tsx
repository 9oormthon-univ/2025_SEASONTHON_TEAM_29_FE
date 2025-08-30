'use client';

import SearchBar from '@/components/common/atomic/SearchBar';
import Header from '@/components/common/monocules/Header';
import { categories } from '@/data/homeData';
import type { CategoryKey } from '@/types/category';
import type { SearchItem } from '@/types/search';
import VendorCard from '../common/atomic/VendorCard';

export default function ResultsScreen({
  items,
}: {
  items: SearchItem[];
  query: {
    cat: CategoryKey | null;
    areas: string[];
    price: number;
    styles: string[];
    meals: string[];
    guest: string | null;
    trans: string[];
  };
}) {
  // 카테고리별 묶기
  const grouped = items.reduce((acc, it) => {
    (acc[it.cat] ??= []).push(it);
    return acc;
  }, {} as Partial<Record<CategoryKey, SearchItem[]>>);

  return (
    <main
      className="mx-auto w-full max-w-[420px] h-dvh flex flex-col overflow-hidden"
      data-hide-bottombar
    >
      <Header value="검색결과" className="h-[70px]" />
      <SearchBar/>

      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+12px)] space-y-6">
        {categories.map(({ key, label }) => {
          const list = grouped[key] ?? [];
          if (!list.length) return null;

          return (
            <section key={key}>
              <h2 className="mb-3 px-1 text-[15px] font-extrabold text-gray-900">{label}</h2>
              <div className="grid grid-cols-3">
                {list.map((it) => (
                  <VendorCard
                    key={it.id}
                    item={{
                      id: it.id,
                      name: it.name,
                      region: it.region,
                      logo: it.logo,
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
      </div>
    </main>
  );
}