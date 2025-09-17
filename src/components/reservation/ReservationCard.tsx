'use client';

import { cn } from '@/utills/cn';

type ReservationCardProps = {
  date: string;
  hallFee: string;
  minGuests: string;
  mealFee: string;
  variant?: 'white' | 'pink';
  selected?: boolean;
  onClick?: () => void;
};

export default function ReservationCard({
  date,
  hallFee,
  minGuests,
  mealFee,
  variant = 'white',
  selected = false,
  onClick,
}: ReservationCardProps) {
  const isPink = selected || variant === 'pink';

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'w-[346px] h-30 relative rounded-lg overflow-hidden transition-colors text-sm font-medium',
        'outline outline-offset-[-1px]',
        isPink
          ? 'bg-primary-200 outline-2 outline-offset-[-2px] outline-primary-300'
          : 'bg-white outline-1 outline-box-line',
      )}
    >
      <div className="absolute left-[103px] top-[10px] text-text--default text-sm font-medium leading-normal">
        {date}
      </div>
      <div className="absolute left-[41px] top-[42px] text-text--default text-sm font-medium leading-7">
        대관료
      </div>
      <div className="absolute left-[20px] top-[70px] text-black text-sm font-bold leading-7">
        {hallFee}
      </div>
      <div className="absolute left-[148px] top-[42px] text-text--default text-sm font-medium leading-7">
        보증인원
      </div>
      <div className="absolute left-[155px] top-[70px] text-black text-sm font-bold leading-7">
        {minGuests}
      </div>
      <div className="absolute left-[272px] top-[42px] text-text--default text-sm font-medium leading-7">
        식대
      </div>
      <div className="absolute left-[243px] top-[70px] text-black text-sm font-bold leading-7">
        {mealFee}
      </div>
    </button>
  );
}
