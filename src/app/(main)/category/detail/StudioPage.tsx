'use client';

import { useState } from 'react';
import Header from '@/components/common/monocules/Header';
import CompanyCard from '@/components/Mypage/CompanyCard';
import SvgObject from '@/components/common/atomic/SvgObject';
import Chip from '@/components/common/atomic/Chips';
import { Search } from 'lucide-react';

type StudioItem = {
  id: string | number;
  name: string;
  region: string;
  imageSrc: string;
  rating: { score: number; count?: number };
  priceText: string;
};

const STUDIOS: StudioItem[] = [
  {
    id: 1,
    name: '그레이스케일',
    region: '선릉',
    imageSrc: '/logos/grayscale.png',
    rating: { score: 4.8, count: 164 },
    priceText: '101만원~',
  },
  {
    id: 2,
    name: '203사진',
    region: '신림',
    imageSrc: '/logos/203.png',
    rating: { score: 4.8, count: 200 },
    priceText: '190만원~',
  },
  {
    id: 3,
    name: 'ST정우',
    region: '청담',
    imageSrc: '/logos/stj.png',
    rating: { score: 4.7, count: 186 },
    priceText: '102만원~',
  },
  {
    id: 4,
    name: 'S 스튜디오',
    region: '강남',
    imageSrc: '/logos/sstudio.png',
    rating: { score: 4.8, count: 293 },
    priceText: '124만원~',
  },
  {
    id: 5,
    name: '노우드',
    region: '서초',
    imageSrc: '/logos/noud.png',
    rating: { score: 4.9, count: 124 },
    priceText: '49만원~',
  },
  {
    id: 6,
    name: '노블스튜디오',
    region: '광주',
    imageSrc: '/logos/noble.png',
    rating: { score: 4.8, count: 164 },
    priceText: '124만원~',
  },
];

export default function StudioListPage() {
  const [selRegion, setSelRegion] = useState(false);
  const [selOutdoor, setSelOutdoor] = useState(false);
  const [selNight, setSelNight] = useState(false);

  return (
    <main className="relative mx-auto w-full max-w-[420px]">
      <Header
        value="스튜디오"
        rightSlot={
          <button type="button" aria-label="검색" className="p-2">
            <Search className="h-5 w-5 text-gray-500" />
          </button>
        }
      />
      <section className="px-5 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Chip
              size="sm"
              selected={selRegion}
              onClick={() => setSelRegion((v) => !v)}
            >
              지역
            </Chip>
            <Chip
              size="sm"
              selected={selOutdoor}
              onClick={() => setSelOutdoor((v) => !v)}
            >
              야외촬영
            </Chip>
            <Chip
              size="sm"
              selected={selNight}
              onClick={() => setSelNight((v) => !v)}
            >
              야간촬영
            </Chip>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-text-secondary"
          >
            <SvgObject
              src="/icons/upDown.svg"
              alt="정렬"
              width={14}
              height={14}
            />
            <span>추천순</span>
          </button>
        </div>
      </section>

      <section className="px-5 pt-4 pb-20">
        <div className="grid grid-cols-3 gap-x-3 gap-y-6">
          {STUDIOS.map((s) => (
            <CompanyCard
              key={s.id}
              variant="category"
              name={s.name}
              region={s.region}
              imageSrc={s.imageSrc}
              rating={s.rating}
              priceText={s.priceText}
              onClick={() => {}}
              alt={`${s.region} ${s.name}`}
            />
          ))}
        </div>
      </section>

      <div className="pb-[env(safe-area-inset-bottom)]" />
    </main>
  );
}
