// src/components/tours/TourTabs.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function TourTabs() {
  const pathname = usePathname() ?? '';
  const router = useRouter();

  // 현재 경로로 활성 탭 판단
  const isRomance = pathname.startsWith('/coming-soon');
  const base = 'flex-1 py-3 text-sm font-medium';
  const active = 'text-black border-b-3 border-primary-500';
  const inactive = 'text-gray-400';

  return (
    <div className="flex">
      <button
        type="button"
        onClick={() => router.push('/tours')}
        className={`${base} ${!isRomance ? active : inactive}`}
        aria-current={!isRomance ? 'page' : undefined}
      >
        드레스 투어
      </button>
      <button
        type="button"
        onClick={() => router.push('/coming-soon')}
        className={`${base} ${isRomance ? active : inactive}`}
        aria-current={isRomance ? 'page' : undefined}
      >
        드레스 로망
      </button>
    </div>
  );
}