'use client';

import Link from 'next/link';
import SvgObject from '../common/atomic/SvgObject';

export default function SummaryCard() {
  return (
    <Link
      href="/calendar/list"
      className="
        flex h-20 items-center justify-center
        rounded-lg border border-zinc-300/50 bg-white
        px-3 py-2.5
        transition hover:border-zinc-300
      "
    >
      <div className="flex items-center gap-2.5">
        <div className="flex size-[45px] items-center justify-center">
          <SvgObject
            alt="일정"
            src="/icons/love.svg"
            width={45}
            height={45}
            className="object-contain"
          />
        </div>
        <span className="text-text--default text-sm font-normal leading-normal">
          일정 모아보기
        </span>
      </div>
    </Link>
  );
}
