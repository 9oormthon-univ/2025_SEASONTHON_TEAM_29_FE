// src/components/my/CompanyCard.tsx
'use client';

import { cn } from '@/utills/cn';
import clsx from 'clsx';
import Image from 'next/image';
import SvgObject from '../common/atomic/SvgObject';

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
  onClick?: () => void | Promise<void>;
  selected?: boolean;
  executionDateTime?: string;
  productName?: string;
  dimImage?: boolean;
  /** ⬇️ 추가된 프롭들 */
  disabled?: boolean;
  selecting?: boolean;
};

const formatDate = (iso?: string) => {
  if (!iso) return null;
  const d = new Date(iso);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}.${mm}.${dd}`;
};

export default function CompanyCard({
  name,
  region,
  imageSrc,
  priceText,
  category,
  productName,
  rating,
  variant = 'category',
  alt,
  className,
  onClick,
  selected = false,
  dimImage = false,
  executionDateTime,
  /** 새 프롭들 기본값 */
  disabled = false,
  selecting = false,
}: Props) {
  const altText = alt ?? name;

  /** CART */
  if (variant === 'cart') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
        aria-pressed={selected}
        className={cn(
          'relative w-28 flex flex-col items-start',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
      >
        {/* 이미지 박스 */}
        <div
          className={clsx(
            'relative w-28 h-28 rounded-lg bg-white overflow-hidden border',
            selected ? 'border-primary-500' : 'border-box-line'
          )}
        >
          <Image
            src={imageSrc}
            alt={altText}
            fill
            className="object-contain"
            priority
            unoptimized
            sizes="112px"
          />
          {dimImage && (
            <div className="absolute inset-0 rounded-lg bg-gray-200/60 pointer-events-none" />
          )}
        </div>

        {/* 뱃지 영역 */}
        <div className="mb-1 mt-1 flex gap-1">
          {category === '웨딩홀' && productName && (
            <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-500">
              {productName === 'Details' ? '단독홀' : productName}
            </span>
          )}
          {executionDateTime && (
            <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-500">
              {formatDate(executionDateTime)}
            </span>
          )}
          {/* 선택 모드 시 스타일 힌트 (필요시 커스텀) */}
          {selecting && (
            <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">
              선택모드
            </span>
          )}
        </div>

        {/* 이름/지역 */}
        {(region || name) && (
          <span className="text-text--default text-sm font-medium leading-normal truncate max-w-[6.5rem]">
            {name}
          </span>
        )}

        {/* 가격 */}
        {priceText && (
          <span className="text-text--default text-xs font-semibold leading-normal">
            {priceText}~
          </span>
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
        disabled={disabled}
        aria-disabled={disabled}
        aria-pressed={selected}
        className={cn(
          'relative w-28 h-44 flex flex-col justify-start pl-1 pr-1',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
      >
        <div
          className={clsx(
            'relative w-28 h-28 bg-white rounded-lg border overflow-hidden',
            selected ? 'border-primary-500' : 'border-box-line'
          )}
        >
          <Image
            src={imageSrc}
            alt={altText}
            fill
            className="object-contain"
            priority
            unoptimized
            sizes="112px"
          />
          {dimImage && (
            <div className="absolute inset-0 rounded-lg bg-gray-200/60 pointer-events-none" />
          )}
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
            <SvgObject src="/icons/PinkRing.svg" alt="rating-ring" width={12} height={12} />
            <span>
              {rating.score}
              {typeof rating.count === 'number' && <span className="text-text-secondary">({rating.count})</span>}
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
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        'relative w-28 h-35 flex flex-col justify-start',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <div className="relative w-28 h-28 bg-white rounded-lg outline-1 outline-offset-[-1px] outline-box-line overflow-hidden">
        <Image
          src={imageSrc}
          alt={altText}
          fill
          className="object-contain"
          priority
          unoptimized
          sizes="112px"
        />
        {dimImage && <div className="absolute inset-0 rounded-lg bg-white/80 pointer-events-none" />}
      </div>

      <div className={cn('mt-2 flex items-center gap-1 pl-0.5')}>
        <span className="text-text-secondary text-sm font-medium leading-normal">{region}</span>
        <span className="text-text--default text-sm font-medium leading-normal truncate">{name}</span>
      </div>

      {rating && (
        <div className="mt-1 flex items-center gap-1 pl-0.5 text-text-secondary text-xs font-medium leading-normal">
          <Image src="/icons/PinkRing.svg" alt="rating-ring" width={12} height={12} />
          <span>
            {rating.score}
            {typeof rating.count === 'number' && <span className="text-text-secondary">({rating.count})</span>}
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