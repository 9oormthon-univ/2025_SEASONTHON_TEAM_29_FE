'use client';

import clsx from 'clsx';
import Image from 'next/image';

type CompanyType = '스튜디오' | '웨딩홀' | '드레스' | '메이크업';

type Props = {
  title: string;
  logoUrl?: string;
  date?: string;
  type: CompanyType;
  onReport?: () => void;
  className?: string;
};

export default function CompanyLongCard({
  title,
  logoUrl,
  date,
  type,
  onReport,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        'relative w-80 h-20',
        'border-y border-box-line',
        className,
      )}
    >
      <div className="absolute left-0 top-1.5 text-primary-500 text-xs font-normal leading-loose">
        {type}
      </div>
      <div className="absolute left-0 top-6 right-20">
        <p className="truncate text-base font-medium text-text--default leading-loose">
          {title}
        </p>
      </div>
      <div className="absolute right-2 top-2 flex items-center gap-2">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white outline outline-1 outline-offset-[-1px] outline-box-line">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="company-logo"
              className="w-16 h-16 object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white" />
          )}
        </div>
        <Image
          src="/icons/arrowRight.svg"
          alt="arrow-right"
          width={16}
          height={16}
          className="mr-[1px]"
        />
      </div>
      <div className="absolute left-0 bottom-1 text-text--secondary text-xs leading-loose">
        <span>{date}</span>
        <span className="px-2">|</span>
        {onReport ? (
          <button
            type="button"
            onClick={onReport}
            className="underline-offset-2 hover:underline"
          >
            신고하기
          </button>
        ) : (
          <span>신고하기</span>
        )}
      </div>
    </div>
  );
}
