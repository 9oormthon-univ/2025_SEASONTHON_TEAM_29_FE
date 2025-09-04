'use client';

import { cn } from '@/utills/cn';
import SvgObject from '../common/atomic/SvgObject';

type Props = {
  title: string;
  address: string;
  dateTime: string;
  imageSrc?: string;
  className?: string;
  onClick?: () => void;
};

export default function ReservationIdCard({
  title,
  address,
  dateTime,
  imageSrc,
  className,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-[346px] h-60 relative rounded-lg outline outline-1 outline-offset-[-1px] outline-box-line overflow-hidden text-left',
        className,
      )}
    >
      <div
        className={cn(
          'absolute inset-0 bg-neutral-900',
          imageSrc && 'bg-center bg-cover',
        )}
        style={imageSrc ? { backgroundImage: `url(${imageSrc})` } : undefined}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-stone-900" />
      <div className="absolute left-4 right-4 bottom-4 space-y-2">
        <h3 className="text-white text-lg font-semibold leading-none">
          {title}
        </h3>
        <div className="flex items-center gap-6 text-white/90 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <SvgObject src="/icons/map.svg" alt="map" width={10} height={14} />
            {address}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <SvgObject src="/icons/watch.svg" alt="watch" width={14} height={14} />
            {dateTime}
          </span>
        </div>
      </div>
    </button>
  );
}
