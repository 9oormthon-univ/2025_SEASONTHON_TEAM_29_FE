'use client';

import clsx from 'clsx';
import Image from 'next/image';

type CheckIconProps = {
  selected: boolean;
  className?: string;
  srcChecked?: string;
  srcUnchecked?: string;
  alt?: string;
};

export default function CheckComponent({
  selected,
  className,
  srcChecked = '/icons/Check.svg',
  srcUnchecked = '/icons/CheckGray.svg',
  alt,
}: CheckIconProps) {
  const src = selected ? srcChecked : srcUnchecked;
  const fallbackAlt = selected ? '선택됨' : '선택 안 됨';

  return (
    <Image
      src={src}
      alt={alt ?? fallbackAlt}
      width={16}
      height={16}
      className={clsx('w-4 h-4', className)}
      priority
    />
  );
}
