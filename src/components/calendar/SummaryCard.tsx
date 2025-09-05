// components/calendar/SummaryCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function SummaryCard() {
  return (
    <Link
      href="/calendar/list"
      className="flex w-[320px] h-16 items-center justify-center
                 rounded-lg border border-zinc-300/50 bg-white
                 shadow-[0_1px_0_rgba(0,0,0,0.02)] px-4"
    >
      <div className="flex items-center gap-3">
        <Image alt="" src="/icons/love.png" width={30} height={30} />
        <span className="text-text--default text-[15px] font-medium leading-normal">
          일정 모아보기
        </span>
      </div>
    </Link>
  );
}