'use client';

import Header from '@/components/common/monocules/Header';
import CompanyCard from '@/components/mypage/CompanyCard';
import { fetchEstimateCart } from '@/services/estimates.api';
import { useEffect, useMemo, useState } from 'react';

type Item = {
  id: number;
  name: string;
  region: string;
  imageSrc: string;
  price: number;
  priceText: string;
  category: '웨딩홀' | '드레스' | '메이크업' | '스튜디오';
};

const KR = (n: number) =>
  new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(n);

export default function EstimateCartPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedByCategory, setSelectedByCategory] = useState<
    Partial<Record<Item['category'], number>>
  >({});
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEstimateCart(ac.signal);
        setItems(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '견적서 조회 실패');
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);
  const toggleOne = (item: Item) => {
    setSelectedByCategory((prev) => {
      const current = prev[item.category];
      if (current === item.id) {
        const next = { ...prev };
        delete next[item.category];
        return next;
      }
      return { ...prev, [item.category]: item.id };
    });
  };
  const total = useMemo(() => {
    const selectedItems = items.filter(
      (i) => selectedByCategory[i.category] === i.id,
    );
    return selectedItems.reduce((s, i) => s + i.price, 0);
  }, [items, selectedByCategory]);

  const groups: Record<Item['category'], Item[]> = {
    웨딩홀: items.filter((i) => i.category === '웨딩홀'),
    드레스: items.filter((i) => i.category === '드레스'),
    메이크업: items.filter((i) => i.category === '메이크업'),
    스튜디오: items.filter((i) => i.category === '스튜디오'),
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <Header value="견적서" />

      <section className="px-5 mt-3">
        <div className="w-full h-20 inline-flex flex-col items-center justify-center rounded-2xl border border-zinc-300/50 bg-white px-7">
          <div className="text-text--default text-sm font-medium leading-normal">
            총 금액
          </div>
          <div className="mt-1 text-xl font-medium leading-normal text-[var(--color-primary-500)]">
            {total === 0 ? '0원' : KR(total)}
          </div>
        </div>
      </section>

      {loading && (
        <p className="px-5 mt-4 text-sm text-text--secondary">
          견적서를 불러오는 중…
        </p>
      )}
      <section className="px-5 mt-6">
        {(Object.keys(groups) as Array<Item['category']>).map((category) => (
          <div key={category} className="mb-8">
            <h3 className="mb-3 text-base font-semibold text-text--default">
              {category}
            </h3>
            <div className="relative -mx-5 overflow-hidden">
              <div
                className="no-scrollbar overflow-x-auto"
                style={{ scrollPaddingLeft: 20, scrollPaddingRight: 20 }}
              >
                <div className="flex gap-[10px] px-5 py-1 snap-x snap-mandatory">
                  {groups[category].length === 0 ? (
                    <div className="text-sm text-text--secondary py-4">
                      담긴 항목이 없어요
                    </div>
                  ) : (
                    groups[category].map((item) => (
                      <CompanyCard
                        key={item.id}
                        variant="cart"
                        name={item.name}
                        region={item.region}
                        imageSrc={item.imageSrc}
                        priceText={item.priceText}
                        selected={selectedByCategory[item.category] === item.id}
                        onClick={() => toggleOne(item)}
                        className="shrink-0 snap-start"
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="h-20" />
    </div>
  );
}
