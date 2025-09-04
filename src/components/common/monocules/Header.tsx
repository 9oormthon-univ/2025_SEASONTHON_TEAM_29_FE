// src/components/common/monocules/Header.tsx
'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

export type HeaderProps = {
  value: string;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
  rightSlot?: ReactNode;
};

export default function Header({
  value,
  showBack = true,
  onBack,
  className,
  rightSlot,
}: HeaderProps) {
  return (
    // 헤더 자체는 문맥에 sticky/fixed로 깔고,
    // 아래 div로 "뷰포트 풀블리드" 처리 → 부모 padding 무시
    <header className={clsx('sticky top-0 z-50', className)}>
      {/* 풀블리드 래퍼 */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen
                      bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60
                      ">
        {/* 내부는 중앙 컨테이너 */}
        <div className="relative mx-auto w-full max-w-[420px] h-[50px] px-[22px]">
          {showBack && (
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={() => (onBack ? onBack() : history.back())}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2"
            >
              <svg
                viewBox="0 0 24 24" width="22" height="22"
                fill="none" stroke="currentColor" strokeWidth="2"
                className="text-text-secondary"
              >
                <path d="M15 18L9 12l6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                          text-base font-medium leading-none text-foreground">
            {value}
          </div>

          {rightSlot && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              {rightSlot}
            </div>
          )}
        </div>
      </div>
      {/* iOS 홈바와 겹치지 않게 아래쪽 safe-area를 쓰고 싶으면, 필요 시 추가
      <div className="pb-[env(safe-area-inset-top)]" /> */}
    </header>
  );
}