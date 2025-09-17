'use client';

import { cn } from '@/utills/cn';
import clsx from 'clsx';
import Image from 'next/image';
import SvgObject from '../common/atomic/SvgObject';
import CheckComponent from '../invitation/CheckComponent';

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
  executionDateTime?: string;
  productName?: string;
  dimImage?: boolean;
  selecting? : boolean;
};

const formatDate = (iso?: string) => {
  if (!iso) return null;
  const d = new Date(iso);
  const yy = String(d.getFullYear()).slice(2); // '26'
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
  category,
  className,
  onClick,
  selected = false,
  dimImage = false,
  executionDateTime,
  selecting = false,
}: Props) {
  const altText = alt ?? name;
  const textDimCls = dimImage ? 'opacity-40' : '';

  /** CART */
  if (variant === 'cart') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn('relative w-28 h-44', className)}
        aria-pressed={selected}
      >
        {/* 이미지 박스 */}
        <div
          className={clsx(
            'w-28 h-28 left-0 top-0 absolute bg-white rounded-lg overflow-hidden outline',
            selected
              ? 'outline-0.5 outline-offset-[-2px] outline-primary-400'
              : 'outline-0.5 outline-offset-[-1px] outline-box-line',
          )}
        >
          <SvgObject
            src={imageSrc}
            alt={alt ?? name}
            className="object-contain"
          />
          {selecting && (
            <div className="absolute top-1 left-1">
              <CheckComponent selected={selected} />
            </div>
          )}
          {dimImage && (
            <div className="absolute inset-0 rounded-lg bg-gray-200/60 pointer-events-none" />
          )}
        </div>
        {/* 왼쪽 뱃지: 카테고리 */}
        {category && (
          <div className="px-1.5 py-0.5 left-0 top-[125px] absolute bg-primary-200 rounded-lg inline-flex justify-center items-center gap-3 overflow-hidden">
            <span className="opacity-80 text-primary-500 text-xs font-medium leading-tight">
              {category}
            </span>
          </div>
        )}

        {/* 오른쪽 뱃지: 날짜 */}
        {executionDateTime && (
          <div className="px-1.5 py-0.5 left-[51px] top-[125px] absolute bg-primary-200 rounded-lg inline-flex justify-center items-center gap-3 overflow-hidden">
            <span className="opacity-80 text-primary-500 text-xs font-medium leading-tight">
              {formatDate(executionDateTime)}
            </span>
          </div>
        )}

        {/* 지역 + 이름 라인 */}
        {(region || name) && (
          <div className="left-0 top-[154px] absolute inline-flex justify-start items-center gap-1">
            {region && (
              <span className="text-text-secondary text-sm font-medium leading-normal">
                {region}
              </span>
            )}
            <span className="text-text--default text-sm font-medium leading-normal truncate max-w-[6.5rem]">
              {name}
            </span>
          </div>
        )}

        {/* 가격 라인 */}
        {priceText && (
          <div className="left-0 top-[175px] absolute inline-flex justify-start items-center gap-1">
            <span className="text-text--default text-xs font-semibold leading-normal">
              {priceText}
              {priceText?.endsWith('~') ? '' : '~'}
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
        'relative w-28 h-35 flex flex-col justify-start',
        className,
      )}
    >
      <div className="relative w-28 h-28 bg-white rounded-lg outline-1 outline-offset-[-1px] outline-box-line overflow-hidden">
        <Image
          src={imageSrc}
          alt={altText}
          fill // ✅
          className="object-contain" // ✅
          priority
          unoptimized
          sizes="112px"
        />
        {dimImage && (
          <div className="absolute inset-0 rounded-lg bg-white/80 pointer-events-none" />
        )}
      </div>

      <div className={cn('mt-2 flex items-center gap-1 pl-0.5', textDimCls)}>
        <span className="text-text-secondary text-sm font-medium leading-normal">
          {region}
        </span>
        <span className="text-text--default text-sm font-medium leading-normal truncate">
          {name}
        </span>
      </div>

      {rating && (
        <div
          className={cn(
            'mt-1 flex items-center gap-1 pl-0.5 text-text-secondary text-xs font-medium leading-normal',
            textDimCls,
          )}
        >
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
        <div
          className={cn(
            'mt-1 pr-14.5 text-text--default text-xs font-semibold leading-normal',
            textDimCls,
          )}
        >
          {priceText}
        </div>
      )}
    </button>
  );
}
