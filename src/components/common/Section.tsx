'use client';

import SvgObject from '@/components/common/atomic/SvgObject';
import * as React from 'react';

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
      lg: 'text-[18px] font-extrabold ',
      xl: 'text-[20px] font-extrabold ',
    }[titleSize] + ' text-text--default leading-tight';

  return (
    <section className={className}>
      {title && (
        <div className="mx-auto w-full" style={{ maxWidth: CONTAINER_MAX }}>
          {/* 타이틀: 컨테이너 안에 그대로 */}
          <div
            className="relative mb-2 flex items-center justify-between"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <h2 className={`${titleCls} truncate`}>{title}</h2>

            {onMore && (
              <button
                type="button"
                onClick={onMore}
                className="shrink-0 active:scale-95 ml-2"
                aria-label="더 보기"
              >
                <SvgObject
                  src="/icons/arrowRight.svg"
                  alt="더보기"
                  width={20}
                  height={20}
                />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2) 콘텐츠 */}
      {bleed === 'viewport' ? (
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
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
