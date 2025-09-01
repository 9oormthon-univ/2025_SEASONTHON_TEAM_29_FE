// components/tours/TourItem.tsx
'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

type Props = {
  name: string;
  logo?: string;                    // 없으면 플레이스홀더
  status: '기록 대기' | '기록 완료';
  onClick?: () => void;             // (선택) 클릭 이동용
};

export default function TourItem({ name, logo, status, onClick }: Props) {
  const isPending = status === '기록 대기';

  const badgeClass = isPending
    ? 'bg-primary-300 text-text-default'
    : 'bg-box-line text-text-secondary';

  return (
    <li
      onClick={onClick}
      className="relative select-none px-[22px] py-4 active:bg-gray-50"
      role={onClick ? 'button' : undefined}
    >
      <div className="flex items-center gap-3">
        {/* 로고 */}
        {logo ? (
          <Image
            src={logo}
            alt={name}
            width={56}
            height={56}
            className="h-[50px] w-[50px] rounded-2xl object-cover ring-1 ring-gray-100"
            priority={false}
          />
        ) : (
          <div
            className="h-[50px] w-[50px] rounded-2xl bg-gray-100 ring-1 ring-gray-100"
            aria-hidden="true"
          />
        )}

        {/* 이름 + 배지 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-gray-900">
              {name}
            </p>
            <span
              className={`rounded-lg px-3 py-1 text-xs ${badgeClass}`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* > 아이콘 */}
        <ChevronRight className="h-5 w-5 shrink-0 text-text-secondary" />
      </div>

      {/* 얇고 연한 inset 구분선 (좌우 여백 맞춤) */}
      <div className="pointer-events-none absolute bottom-0 left-[22px] right-[22px] h-px bg-gray-200/60" />
    </li>
  );
}