// src/components/my/ContractsTab.tsx
'use client';

import VendorCard from '@/components/common/atomic/VendorCard';
import type { ContractGroup } from '@/types/contract';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';

export default function ContractsTab({
  groups,
  loading,
  error,
}: {
  groups: ContractGroup[];
  loading: boolean;
  error: string | null;
}) {
  if (loading)
    return <p className="text-sm text-text-secondary pt-5">불러오는 중…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!groups.length)
    return <p className="text-sm text-text-secondary pt-5">계약 내역이 없어요.</p>;

  return (
    <div className="flex flex-col gap-6 pt-5">
      {groups.map((group) => {
        const dateObj = new Date(group.executionDate);
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();

        return (
          <div key={group.executionDate}>
            {/* 날짜 헤더 */}
            <div className="justify-start text-text--default text-sm font-medium font-['Inter'] leading-normal pb-2">
              {month}월 {day}일
            </div>

            {/* 좌우 스와이프 슬라이드 */}
            <ContractCarousel contracts={group.contracts} />
          </div>
        );
      })}
    </div>
  );
}

function ContractCarousel({
  contracts,
}: {
  contracts: ContractGroup['contracts'];
}) {
  const [ref, api] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  });
  const [, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    api.on('select', update);
    api.on('reInit', update);
    update();
    return () => {
      api?.off('select', update);
      api?.off('reInit', update);
    };
  }, [api]);
  console.log(contracts);

  return (
    <div ref={ref} className="overflow-hidden">
      <div className="flex gap-3">
        {contracts.map((c) => (
          <div key={c.contractId} className="flex-[0_0_auto] w-[120px]">
            <VendorCard
              item={{
                vendorId: c.vendorId,
                vendorName: c.vendorName,
                logoImageUrl: c.logoImageUrl,
                regionName: c.regionName,
                averageRating: undefined,
                reviewCount: undefined,
                minPrice: undefined,
              }}
              href={`/mypage/contracts/${c.contractId}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
