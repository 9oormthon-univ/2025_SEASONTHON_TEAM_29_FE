'use client';

import { useRouter } from 'next/navigation';

export default function VendorActions({ vendorId }: { vendorId: number }) {
  const router = useRouter();
  return (
    <div className="px-4">
      <div className="mt-2 text-[13px] leading-relaxed text-gray-700" />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          className="h-11 rounded-xl bg-primary-500 text-sm font-bold text-white active:scale-[0.99]"
          onClick={() => router.push(`/booking?vendor=${vendorId}`)}
        >
          예약하러가기
        </button>
        <button
          className="h-11 rounded-xl border border-gray-200 text-sm font-bold active:scale-[0.99]"
          onClick={() => router.push(`/reviews?vendor=${vendorId}`)}
        >
          리뷰 보러가기
        </button>
      </div>
    </div>
  );
}