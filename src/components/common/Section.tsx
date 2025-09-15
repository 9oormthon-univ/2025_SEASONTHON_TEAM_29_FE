'use client';

import * as React from 'react';
import SvgObject from '@/components/common/atomic/SvgObject';

type SectionProps = {
  title?: string;
  onMore?: () => void;
  bleed?: 'none' | 'viewport';
  contentAlign?: 'container' | 'edge';
  titleSize?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children: React.ReactNode;
};

const CONTAINER_MAX = 420;
const CONTAINER_PX = 22;

export default function Section({
  title,
  onMore,
  bleed = 'none',
  contentAlign = 'container',
  titleSize = 'lg',
  className,
  children,
}: SectionProps) {
  const titleCls =
    {
      sm: 'text-sm font-bold',
      md: 'text-[14px] font-extrabold',
      lg: 'text-[18px] font-extrabold tracking-[-0.2px]',
      xl: 'text-[20px] font-extrabold tracking-[-0.2px]',
    }[titleSize] + ' text-text--default leading-tight';

  return (
    <section className={className}>
      {title && (
        <div className="mx-auto w-full" style={{ maxWidth: CONTAINER_MAX }}>
          {/* 타이틀: 컨테이너 안에 그대로 */}
          <div
            className="relative mb-2"
            style={{ paddingLeft: CONTAINER_PX, paddingRight: CONTAINER_PX }}
          >
            <h2 className={`${titleCls} pr-8 truncate -ml-5`}>{title}</h2>

            {/* 버튼만 화면 전폭(w-screen) 래퍼로 빼서 오른쪽 끝 정렬 */}
            {onMore && (
              <div className="pointer-events-none absolute inset-0">
                <div className="pointer-events-auto relative left-1/2 -ml-[50vw] w-screen">
                  <div
                    className="flex justify-end"
                    style={{ paddingRight: CONTAINER_PX }}
                  >
                    <button
                      type="button"
                      onClick={onMore}
                      className="shrink-0 active:scale-95"
                      aria-label="더 보기"
                    >
                      <SvgObject
                        src="/icons/arrowRight.svg"
                        alt="더보기"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2) 콘텐츠 */}
      {bleed === 'viewport' ? (
        <div className="pl-1 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          {contentAlign === 'container' ? (
            <div className="mx-auto w-full" style={{ maxWidth: CONTAINER_MAX }}>
              {children}
            </div>
          ) : (
            <div
              style={{ paddingLeft: CONTAINER_PX, paddingRight: CONTAINER_PX }}
            >
              {children}
            </div>
          )}
        </div>
      ) : (
        <div
          className="mx-auto w-full"
          style={{
            maxWidth: CONTAINER_MAX,
            paddingLeft: CONTAINER_PX,
            paddingRight: CONTAINER_PX,
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
}
