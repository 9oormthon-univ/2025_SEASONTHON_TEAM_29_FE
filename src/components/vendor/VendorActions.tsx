'use client';

import { useRouter } from 'next/navigation';
import SvgObject from '../common/atomic/SvgObject';

export default function VendorActions({ vendorId }: { vendorId: number }) {
  const router = useRouter();

  const baseBtn =
    'flex items-center justify-center gap-2 h-18 rounded-xl border border-gray-200 text-sm font-base active:scale-[0.99]';

  return (
    <div className="px-4">
      <div className="mt-4 grid grid-cols-1 gap-2">
        <button
          className={baseBtn}
          onClick={() => router.push(`/vendor/${vendorId}/reviews`)}
        >
          <SvgObject src="/icons/Chat.svg" className="h-6 w-6" />
          리뷰 보러가기
        </button>
      </div>
    </div>
  );
}