// src/app/(main)/category/detail/StudioPage.tsx
'use client';

import Chip from '@/components/common/atomic/Chips';
import SvgObject from '@/components/common/atomic/SvgObject';
import VendorCard from '@/components/common/atomic/VendorCard';
import Header from '@/components/common/monocules/Header';
import { useVendorsByCategory } from '@/hooks/useVendorsByCategory';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function StudioListPage() {
  const router = useRouter();
  const [selRegion, setSelRegion] = useState(false);
  const [selOutdoor, setSelOutdoor] = useState(false);
  const [selNight, setSelNight] = useState(false);

  // ✅ 스튜디오 벤더 데이터 훅
  const { items, loading, error, hasMore, loadMore } =
    useVendorsByCategory('STUDIO', 30);

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

      {/* 필터 */}
      <section className="px-5 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Chip size="sm" selected={selRegion} onClick={() => setSelRegion(v => !v)}>
              지역
            </Chip>
            <Chip size="sm" selected={selOutdoor} onClick={() => setSelOutdoor(v => !v)}>
              야외촬영
            </Chip>
            <Chip size="sm" selected={selNight} onClick={() => setSelNight(v => !v)}>
              야간촬영
            </Chip>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-text-secondary"
          >
            <SvgObject src="/icons/upDown.svg" alt="정렬" width={14} height={14} />
            <span>추천순</span>
          </button>
        </div>
      </section>

      {/* 업체 리스트 */}
      <section className="px-5 pt-4 pb-20">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="grid grid-cols-3 gap-x-3 gap-y-6">
          {items.map((s) => (
            <VendorCard
              key={s.id}
              item={{
                id: s.id,
                name: s.name,
                region: s.region,
                logo: s.logo,
                rating: s.rating,
                count: s.count,
                price: s.price,
                href: `/reservation/company/months?step=2&vendorId=${s.id}`,
              }}
              showPrice={true} // 가격 보이게 할지 여부
            />
          ))}
        </div>

        {/* 더 보기 */}
        <div className="mt-6 flex items-center justify-center">
          {hasMore ? (
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="px-4 h-10 rounded-full text-sm font-medium outline-1 outline-box-line disabled:opacity-50"
            >
              {loading ? '불러오는 중…' : '더 보기'}
            </button>
          ) : (
            <p className="text-sm text-text-secondary">마지막 페이지예요</p>
          )}
        </div>
      </section>

      <div className="pb-[env(safe-area-inset-bottom)]" />
    </main>
  );
}