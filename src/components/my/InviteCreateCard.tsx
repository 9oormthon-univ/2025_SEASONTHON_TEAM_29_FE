// src/components/my/InviteCreateCard.tsx
'use client';

import SvgObject from '@/components/common/atomic/SvgObject';
import { useRouter } from 'next/navigation';

export default function InviteCreateCard() {
  const router = useRouter();
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => router.push('/mypage/invite/editor')}
        className="mx-auto flex h-56 w-full max-w-80 flex-col items-center justify-center text-gray-400"
      >
        <SvgObject src="/icons/plus.svg" />
        <span className="pt-3 text-sm">모바일 청첩장 제작</span>
      </button>
    </div>
  );
}