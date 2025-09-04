'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/common/monocules/Header';
import CompanyCard from '@/components/Mypage/CompanyCard';

type Item = {
  id: number;
  name: string;
  region: string;
  imageSrc: string;
  price: number;
  priceText: string;
  category: '웨딩홀' | '드레스' | '메이크업' | '스튜디오';
};

const ITEMS: Item[] = [
  // 웨딩홀
  {
    id: 1,
    name: '논현 더채플',
    region: '논현',
    imageSrc: '/logos/chapel.png',
    price: 110000000,
    priceText: '1100만원~',
    category: '웨딩홀',
  },
  {
    id: 2,
    name: '반포 아펠가모',
    region: '반포',
    imageSrc: '/logos/apelgamo.png',
    price: 106500000,
    priceText: '1065만원~',
    category: '웨딩홀',
  },
  // 드레스
  {
    id: 3,
    name: '렌느브라이덜',
    region: '청담',
    imageSrc: '/logos/reine.png',
    price: 10000000,
    priceText: '100만원~',
    category: '드레스',
  },
  {
    id: 4,
    name: '조슈아벨',
    region: '선릉',
    imageSrc: '/logos/joshua.png',
    price: 12800000,
    priceText: '128만원~',
    category: '드레스',
  },
  {
    id: 5,
    name: '우아르',
    region: '청담',
    imageSrc: '/logos/wooarr.png',
    price: 13000000,
    priceText: '130만원~',
    category: '드레스',
  },
  {
    id: 7,
    name: '우아르',
    region: '청담',
    imageSrc: '/logos/wooarr.png',
    price: 13000000,
    priceText: '130만원~',
    category: '드레스',
  },
  {
    id: 8,
    name: '우아르',
    region: '청담',
    imageSrc: '/logos/wooarr.png',
    price: 13000000,
    priceText: '130만원~',
    category: '드레스',
  },
  // 메이크업
  {
    id: 6,
    name: '겐크리아',
    region: '청담',
    imageSrc: '/logos/cenchrea.png',
    price: 9300000,
    priceText: '93만원~',
    category: '메이크업',
  },
  {
    id: 7,
    name: '제니하우스',
    region: '서초',
    imageSrc: '/logos/jh.png',
    price: 7150000,
    priceText: '71만 5천원~',
    category: '메이크업',
  },
  // 스튜디오
  {
    id: 8,
    name: '203사진관',
    region: '선릉',
    imageSrc: '/logos/203.png',
    price: 19000000,
    priceText: '190만원~',
    category: '스튜디오',
  },
];

const KR = (n: number) =>
  new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(n);

export default function EstimateCartPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggler = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const total = useMemo(
    () =>
      ITEMS.filter((i) => selectedIds.includes(i.id)).reduce(
        (s, i) => s + i.price,
        0,
      ),
    [selectedIds],
  );

  const groups: Record<Item['category'], Item[]> = {
    웨딩홀: ITEMS.filter((i) => i.category === '웨딩홀'),
    드레스: ITEMS.filter((i) => i.category === '드레스'),
    메이크업: ITEMS.filter((i) => i.category === '메이크업'),
    스튜디오: ITEMS.filter((i) => i.category === '스튜디오'),
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <Header value="견적서" />

      <section className="px-5 mt-3">
        <div
          className="
      w-full h-20 inline-flex flex-col items-center justify-center
      rounded-2xl border border-zinc-300/50 bg-white
      px-7
    "
        >
          <div className="text-text--default text-sm font-medium leading-normal">
            총 금액
          </div>
          <div className="mt-1 text-xl font-medium leading-normal text-[var(--color-primary-500)]">
            {total === 0 ? '0원' : KR(total)}
          </div>
        </div>
      </section>
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
                  {groups[category].map((item) => (
                    <CompanyCard
                      key={item.id}
                      variant="cart"
                      name={item.name}
                      region={item.region}
                      imageSrc={item.imageSrc}
                      priceText={item.priceText}
                      selected={selectedIds.includes(item.id)}
                      onClick={() => toggler(item.id)}
                      className="shrink-0 snap-start"
                    />
                  ))}
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
