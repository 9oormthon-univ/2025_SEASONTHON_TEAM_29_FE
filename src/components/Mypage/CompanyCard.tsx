'use client';

import { cn } from '@/utills/cn';
import Image from 'next/image';
import SvgObject from '../common/atomic/SvgObject';
import clsx from 'clsx';

type Category = '스튜디오' | '웨딩홀' | '드레스' | '메이크업';
type Variant = 'review' | 'category' | 'cart';

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
  selected?: boolean;
};

export default function CompanyCard({
  name,
  region,
  imageSrc,
  priceText,
  rating,
  variant = 'category',
  alt,
  className,
  onClick,
  selected = false,
}: Props) {
  const altText = alt ?? name;

  /** CART */
  if (variant === 'cart') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'relative w-28 h-44 flex flex-col justify-start',
          className,
        )}
      >
        <div
          className={clsx(
            'w-28 h-28 rounded-lg flex items-center justify-center bg-white overflow-hidden border',
            selected ? 'border-primary-500' : 'border-box-line',
          )}
        >
          <Image
            src={imageSrc}
            alt={altText}
            width={112}
            height={112}
            className="w-28 h-28 object-contain"
            priority
          />
        </div>
        <div className="mt-2 pl-0.5 text-text-secondary text-sm font-medium leading-normal">
          {region}
        </div>
        <div className="mt-[2px] pl-0.5 text-text--default text-sm font-medium leading-normal truncate">
          {name}
        </div>
        {priceText && (
          <div className="mt-1 pl-0.5 text-text--default text-xs font-semibold leading-normal">
            {priceText}
          </div>
        )}
      </button>
    );
  }

  /** REVIEW */
  if (variant === 'review') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'relative w-28 h-44 flex flex-col justify-start pl-1 pr-1',
          className,
        )}
      >
        <div className="w-28 h-28 bg-white rounded-lg border border-box-line flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={altText}
            width={112}
            height={112}
            className="object-contain"
            priority
          />
        </div>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-text-secondary text-sm font-medium leading-normal">
            {region}
          </span>
          <span className="text-text--default text-sm font-medium leading-normal truncate">
            {name}
          </span>
        </div>
        {rating && (
          <div className="mt-1 flex items-center gap-1 text-text-secondary text-xs font-medium leading-normal">
            <SvgObject
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

  /** CATEGORY */
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative w-28 h-44 flex flex-col justify-start',
        className,
      )}
    >
      <div className="w-28 h-28 bg-white rounded-lg outline-1 outline-offset-[-1px] outline-box-line overflow-hidden">
        <Image
          src={imageSrc}
          alt={altText}
          width={112}
          height={112}
          className="w-28 h-28 object-cover"
          priority
        />
      </div>
      <div className="mt-2 flex items-center gap-1 pl-0.5">
        <span className="text-text-secondary text-sm font-medium leading-normal">
          {region}
        </span>
        <span className="text-text--default text-sm font-medium leading-normal truncate">
          {name}
        </span>
      </div>
      {rating && (
        <div className="mt-1 flex items-center gap-1 pl-0.5 text-text-secondary text-xs font-medium leading-normal">
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
        <div className="mt-1 pr-14.5 text-text--default text-xs font-semibold leading-normal">
          {priceText}
        </div>
      )}
    </button>
  );
}
