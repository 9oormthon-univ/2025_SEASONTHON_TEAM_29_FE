'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import SvgObject from '../common/atomic/SvgObject';

type CompanyType = '스튜디오' | '웨딩홀' | '드레스' | '메이크업';

type Props = {
  vendorId: number;               // ✅ 추가
  title: string;
  logoUrl?: string;
  date?: string;
  type: CompanyType;
  className?: string;
};

export default function CompanyLongCard({
  vendorId,
  title,
  logoUrl,
  date,
  type,
  className,
}: Props) {
  return (
    <Link
      href={`/vendor/${vendorId}`}  // ✅ 클릭 시 이동
      className={clsx(
        'relative w-80 h-22',
        'border-y border-box-line',
        'block cursor-pointer active:bg-gray-50', // ✅ 버튼 느낌
        className,
      )}
    >
      <div className="absolute left-0 top-1.5 text-primary-500 text-xs font-normal leading-loose">
        {type}
      </div>
      <div className="absolute left-0 top-7 right-20">
        <p className="truncate text-base font-medium text-text--default leading-loose">
          {title}
        </p>
      </div>
      <div className="absolute right-2 top-3 flex items-center gap-2">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white outline-1 outline-offset-[-1px] outline-box-line">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="company-logo"
              width={64}
              height={64}
              className="w-16 h-16 object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-white" />
          )}
        </div>
        <SvgObject
          src="/icons/arrowRight.svg"
          alt="arrow-right"
          width={16}
          height={16}
          className="mr-[1px]"
        />
      </div>
      <div className="absolute left-0 bottom-1 text-text--secondary text-xs leading-loose">
        <span>{date}</span>
      </div>
    </Link>
  );
}