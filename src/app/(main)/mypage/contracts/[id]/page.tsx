// src/app/mypage/contracts/[id]/page.tsx
'use client';

import SvgObject from '@/components/common/atomic/SvgObject';
import Header from '@/components/common/monocules/Header';
import { getContractDetail } from '@/services/contract.api';
import type { ContractDetail } from '@/types/contract';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getContractDetail(Number(id));
        setDetail(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '계약 상세 조회 실패');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>로딩 중…</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!detail) return null;

  const dateObj = new Date(detail.executionDateTime);
  const dateStr = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 A.M.${dateObj.getHours()}`;
  return (
    <div className="w-full max-w-[420px] mx-auto min-h-screen flex flex-col">
      <Header value="예약상세" showBack onBack={() => router.back()} />
  
      <div className="absolute inset-0 flex items-center justify-center p-5">
        <div className="relative w-full w-[346px] h-[246px] rounded-xl overflow-hidden shadow">
          <Image
            src={detail.repImageUrl || '/logos/placeholder.png'}
            alt={detail.vendorName}
            fill
            className="object-cover"
            unoptimized
          />
  
          {/* 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  
          {/* 좌측 하단 텍스트 */}
          <div className="absolute bottom-5 left-5 text-white">
            <div className="text-lg font-bold leading-normal pb-3">{detail.vendorName}</div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <SvgObject src="/icons/pin.svg" alt="위치" width={16} height={16} />
              <span>{detail.vendorAddress}</span>
            </div>
          </div>
  
          {/* 우측 하단 계약 시간 */}
          <div className="absolute bottom-5 right-5 flex items-center gap-2 text-white text-xs">
            <SvgObject src="/icons/clockwhite.svg" alt="시간" width={18} height={18} />
            <span>{dateStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}