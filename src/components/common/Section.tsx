// components/common/Section.tsx
import clsx from 'clsx';
import React from 'react';

type SectionProps = {
  title?: string;
  onMore?: () => void;
  /** 콘텐츠 폭: 'none' = 일반, 'viewport' = 뷰포트로 edge-bleed */
  bleed?: 'none' | 'viewport';
  /** edge-bleed일 때 내부 정렬: 'container' = 중앙정렬, 'edge' = 좌우 끝까지 */
  contentAlign?: 'container' | 'edge';
  titleSize?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children: React.ReactNode;
};

export default function Section({
  title,
  onMore,
  bleed = 'none',
  contentAlign = 'container',
  titleSize = 'lg',
  className,
  children,
}: SectionProps) {
  const titleCls = {
    sm: 'text-sm font-bold',
    md: 'text-base font-bold',
    lg: 'text-lg font-extrabold',
    xl: 'text-xl font-extrabold',
  }[titleSize];

  return (
    <section className={clsx('mt-8', className)}>
      {/* 1) 타이틀은 항상 중앙 컨테이너 */}
      {title &&
      <div className="mx-auto w-full max-w-[420px] px-[22px]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className={titleCls}>{title}</h2>
          {onMore && (
            <button onClick={onMore} className="text-sm text-gray-500">
              더보기
            </button>
          )}
        </div>
      </div>
      }

      {/* 2) 콘텐츠 */}
      {bleed === 'viewport' ? (
        // 뷰포트 전폭으로 빼되, 섹션 중앙 기준을 유지하기 위한 보정 래퍼
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          {contentAlign === 'container' ? (
            // 전폭 배경/터치영역 + 내부는 여전히 중앙 컨테이너
            <div className="mx-auto w-full max-w-[420px]">
              {children}
            </div>
          ) : (
            // 진짜 edge까지 붙이고 싶을 때(가로 스크롤 등)
            <div className="px-[22px]">{children}</div>
          )}
        </div>
      ) : (
        // 일반 섹션
        <div className="mx-auto w-full max-w-[420px] px-[22px]">
          {children}
        </div>
      )}
    </section>
  );
}