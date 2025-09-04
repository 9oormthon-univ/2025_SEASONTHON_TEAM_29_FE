'use client';

import Image from 'next/image';
import { useState } from 'react';
import Header from '@/components/common/monocules/Header';
import DdayCard from '@/components/Mypage/D-dayCheck';
import CompanyCard from '@/components/Mypage/CompanyCard';
import BottomNav from '@/components/common/atomic/BottomNav';
import Link from 'next/link';

type Company = {
  id: string;
  region: string;
  name: string;
  imageSrc: string;
};

type ReviewCompany = Company & {
  rating: { score: number; count?: number };
};

const RESERVE_0830: Company[] = [
  {
    id: '1',
    region: '선릉',
    name: '그레이스케일',
    imageSrc: '/logos/grayscale.png',
  },
  { id: '2', region: '서초', name: '제니하우스', imageSrc: '/logos/jh.png' },
  { id: '3', region: '청담', name: 'ST정우', imageSrc: '/logos/stj.png' },
];

const REVIEW_LIST: ReviewCompany[] = [
  {
    id: 'w1',
    region: '압구정',
    name: '정샘물',
    imageSrc: '/logos/jsm.png',
    rating: { score: 4.8, count: 164 },
  },
  {
    id: 'w2',
    region: '청담',
    name: '순수',
    imageSrc: '/logos/soonsoo.png',
    rating: { score: 4.5, count: 92 },
  },
];

export default function Page() {
  const [tab, setTab] = useState<'reserve' | 'review'>('reserve');

  return (
    <main className=" min-h-screen bg-background pb-24">
      <section className="px-5 pt-2 max-w-96 mx-auto">
        <Header value="마이" />
        <div className="flex flex-col items-center gap-2 py-4">
          <Image
            src="/defaultProfile.svg"
            alt="profile"
            width={88}
            height={88}
            className="rounded-full"
            priority
          />
          <div className="text-[17px] font-medium text-foreground">
            김수민 신부님
          </div>
          <Link
            href="/mypage/connection"
            className="text-[13px] text-rose-400 underline underline-offset-4"
          >
            예비 배우자와 연결하기
          </Link>
        </div>

        <DdayCard target="2026-05-10" className="w-80 h-36 mx-auto" />
        <div className="mt-6 flex items-center gap-6 px-1">
          <button
            onClick={() => setTab('reserve')}
            className={`pb-2 text-[17px] ${
              tab === 'reserve'
                ? 'text-foreground border-b-2 border-rose-300'
                : 'text-text-secondary'
            }`}
          >
            내 예약
          </button>
          <button
            onClick={() => setTab('review')}
            className={`pb-2 text-[17px] ${
              tab === 'review'
                ? 'text-foreground border-b-2 border-rose-300'
                : 'text-text-secondary'
            }`}
          >
            후기
          </button>
        </div>

        {tab === 'reserve' ? (
          <div className="mt-4 space-y-6">
            <div>
              <div className="mb-3 text-sm font-medium text-foreground">
                8월 30일
              </div>
              <div className="grid grid-cols-3 gap-3">
                {RESERVE_0830.map((c) => (
                  <CompanyCard
                    key={c.id}
                    region={c.region}
                    name={c.name}
                    imageSrc={c.imageSrc}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-medium text-foreground">
                8월 29일
              </div>
              <div className="grid grid-cols-3 gap-3 opacity-40">
                <CompanyCard
                  region="압구정"
                  name="정샘물"
                  imageSrc="/logos/jsm.png"
                />
                <CompanyCard
                  region="청담"
                  name="순수"
                  imageSrc="/logos/soonsoo.png"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-1 text-[15px] text-text-default font-medium">
                <span>최신순</span>
                <Image
                  src="/icons/arrowDown.svg"
                  alt="arrow-down"
                  width={20}
                  height={20}
                  priority
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button className="w-28 h-28 rounded-lg outline-1 outline-offset-[-1px] outline-box-line flex flex-col items-center justify-center gap-2 text-text-secondary">
                <Image
                  src="/icons/plus.svg"
                  alt="plus"
                  width={26}
                  height={26}
                  className="rounded-full"
                  priority
                />
                <span>후기작성</span>
              </button>
              {REVIEW_LIST.map((c) => (
                <CompanyCard
                  key={c.id}
                  variant="review"
                  region={c.region}
                  name={c.name}
                  imageSrc={c.imageSrc}
                  rating={c.rating}
                />
              ))}
            </div>
          </div>
        )}
      </section>
      <BottomNav innerMax="max-w-96" />
      <div className="h-16 pb-[env(safe-area-inset-bottom)]" />
    </main>
  );
}
