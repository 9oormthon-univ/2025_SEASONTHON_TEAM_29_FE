'use client';

import Image from 'next/image';
import { cn } from '@/utills/cn';

type Props = {
  name: string;
  region: string;
  imageSrc: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
};

export default function CompanyCard({
  name,
  region,
  imageSrc,
  alt = name,
  className,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('relative w-28 h-44 text-left', className)}
    >
      <div className="absolute left-0 top-0 w-28 h-[118px] bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-box-line overflow-hidden p-[5px]">
        <Image
          src={imageSrc}
          alt={alt}
          width={108}
          height={108}
          className="w-[108px] h-[108px] object-cover"
          priority
        />
      </div>

      <div className="absolute left-0 top-[122px] inline-flex items-center gap-1 max-w-full pr-1">
        <span className="text-text-secondary text-sm font-medium leading-normal whitespace-nowrap">
          {region}
        </span>
        <span className="text-text--default text-sm font-medium leading-normal truncate">
          {name}
        </span>
      </div>
    </button>
  );
}
