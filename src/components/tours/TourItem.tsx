'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

type Props = {
  name: string;
  logo?: string; // 없으면 플레이스홀더
  status?: '기록 대기' | '기록 완료';
  onClick?: () => void;
  withLogo?: boolean; // ✅ 로고 영역 표시 여부 (기본 true)
};

export default function TourItem({ name, logo, status, onClick, withLogo = true }: Props) {
  const isPending = status === '기록 대기';

  const badgeClass = isPending
    ? 'bg-primary-300 text-text-default'
    : 'bg-box-line text-text-secondary';

  return (
    <li
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : -1}
      className="relative select-none px-[22px] py-4 active:bg-gray-50 cursor-pointer outline-none focus:bg-gray-50"
      role={onClick ? 'button' : undefined}
    >
      <div className="flex items-center gap-3">
        {/* 로고 (옵션) */}
        {withLogo && (
          logo ? (
            <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-gray-200">
              <Image
                src={logo}
                alt={name}
                fill
                className="object-contain"
                sizes="40px"
                draggable={false}
                unoptimized
              />
            </div>

          ) : (
            <div
              className="h-[50px] w-[50px] rounded-2xl bg-gray-100 ring-1 ring-gray-100"
              aria-hidden="true"
            />
          )
        )}

        {/* 이름 + 배지 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-gray-900">
              {name}
            </p>
            {status && 
              <span className={`rounded-lg px-2 py-1 text-xs ${badgeClass}`}>
                {status}
              </span>
            }
            
          </div>
        </div>

        <ChevronRight className="h-5 w-5 shrink-0 text-text-secondary" />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-[22px] right-[22px] h-px bg-gray-200/60" />
    </li>
  );
}