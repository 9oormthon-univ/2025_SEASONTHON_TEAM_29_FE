'use client';

import clsx from 'clsx';
import Image from 'next/image';

type CheckIconProps = {
  selected: boolean;
  className?: string;
  srcChecked?: string;
  srcUnchecked?: string;
  alt?: string;
  unoptimized?: boolean;
};

export default function CheckComponent({
  selected,
  className,
  srcChecked = '/icons/check.png',
  srcUnchecked = '/icons/CheckGray.png',
  alt,
  unoptimized = true,
}: CheckIconProps) {
  const src = selected ? srcChecked : srcUnchecked;
  const fallbackAlt = selected ? '선택됨' : '선택 안 됨';

  return (
    <Image
      src={src}
      alt={alt ?? fallbackAlt}
      width={16}
      height={16}
      unoptimized
      draggable={false}
      className={clsx('w-4 h-4', className)}
      sizes="16px"
    />
  );
}
