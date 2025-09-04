// src/components/common/atomic/SvgObject.tsx
'use client';

import clsx from 'clsx';
import Image from 'next/image';

type Props = {
  /** /public 기준 경로 혹은 절대경로 */
  src: string;
  /** 아이콘이 의미있으면 label, 장식이면 그냥 빈 문자열("") */
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  /** 아이콘을 클릭-스루(장식용)로 만들고 싶을 때 true(기본 true) */
  decorative?: boolean;
};

export default function SvgObject({
  src,
  alt = '',
  width,
  height,
  className,
  decorative = true,
}: Props) {
  // object는 alt 속성이 없어 role/aria-label로 접근성 처리
  const isDecorative = alt === '' || decorative;

  return (
    <object
      data={src}
      type="image/svg+xml"
      width={width}
      height={height}
      // 렌더링 깨짐/라인 깨짐 방지: block + select-none + 필요시 will-change
      className={clsx(
        'block select-none',
        decorative && 'pointer-events-none',
        className,
      )}
      role={isDecorative ? undefined : 'img'}
      aria-label={isDecorative ? undefined : alt}
      aria-hidden={isDecorative ? true : undefined}
      tabIndex={-1}
    >
      {/* 폴백: 혹시 object 로드 실패 시 */}
      <Image
        src={src}
        alt={alt}
        width={width ?? 24}
        height={height ?? 24}
        draggable={false}
        unoptimized
      />
    </object>
  );
}
