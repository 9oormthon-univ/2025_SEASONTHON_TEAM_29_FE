'use client';

import Image from 'next/image';
import { cn } from '@/utills/cn';

type Category = '스튜디오' | '웨딩홀' | '드레스' | '메이크업';
type Variant = 'review' | 'category';

type Props = {
  name: string;
  region: string;
  imageSrc: string;
  priceText?: string;
  rating?: { score: number; count?: number };
  category?: Category;
  variant?: Variant;
  alt?: string;
  className?: string;
  onClick?: () => void;
};

export default function CompanyCard({
  name,
  region,
  imageSrc,
  priceText,
  rating,
  category,
  variant = 'category',
  alt,
  className,
  onClick,
}: Props) {
  const altText = alt ?? name;

  if (variant === 'review') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn('relative w-28 h-44 text-left', className)}
      >
        <div className="absolute left-0 top-0 w-28 h-28 bg-white rounded-lg border border-box-line flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={altText}
            width={112}
            height={112}
            className="object-contain"
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
        {rating && (
          <div className="absolute left-[1px] top-[138px] flex items-center gap-[5px] text-text-secondary text-xs font-medium leading-normal">
            <Image
              src="/icons/PinkRing.svg"
              alt="rating-ring"
              width={12}
              height={12}
            />
            <span>
              {rating.score}
              {typeof rating.count === 'number' && (
                <span className="text-text-secondary">({rating.count})</span>
              )}
            </span>
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('relative w-28 h-44 text-left', className)}
    >
      <div className="absolute left-0 top-0 w-28 h-28 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-box-line overflow-hidden">
        <Image
          src={imageSrc}
          alt={altText}
          width={112}
          height={112}
          className="w-28 h-28 object-cover"
          priority
        />
      </div>

      <div className="absolute left-0 top-[113px] inline-flex items-start gap-1 max-w-full pr-1">
        <span className="text-text-secondary text-sm font-medium leading-normal whitespace-nowrap">
          {region}
        </span>
        <span className="text-text--default text-sm font-medium leading-normal truncate">
          {name}
        </span>
      </div>

      {rating && (
        <div className="absolute left-[1px] top-[136px] flex items-center gap-[5px] text-text-secondary text-xs font-medium leading-normal">
          <Image
            src="/icons/PinkRing.svg"
            alt="rating-ring"
            width={12}
            height={12}
          />
          <span>
            {rating.score}
            {typeof rating.count === 'number' && (
              <span className="text-text-secondary">({rating.count})</span>
            )}
          </span>
        </div>
      )}

      {priceText && (
        <div className="absolute left-[1px] top-[156px] text-text--default text-xs font-semibold leading-normal">
          {priceText}
        </div>
      )}
    </button>
  );
}
