'use client';

import { cn } from '@/utills/cn';
import Image from 'next/image';

type Category = {
  key: string;
  label: string;
  icon: string;
};

const mockCategories: Category[] = [
  { key: 'hall', label: '웨딩홀', icon: '/icons/Category/weddinghall.svg' },
  { key: 'dress', label: '드레스', icon: '/icons/Category/dress.svg' },
  { key: 'studio', label: '스튜디오', icon: '/icons/Category/studio.svg' },
  { key: 'makeup', label: '메이크업', icon: '/icons/Category/makeup.svg' },
];

export default function CategoryQuick({ bgColor = 'gray' }: { bgColor?: 'gray' | 'white' }) {
  return (
    <div
      className={cn(
        'mt-5 grid grid-cols-4 gap-2 rounded-2xl',
        bgColor === 'gray' ? 'bg-gray-100' : 'bg-white'
      )}
    >
      {mockCategories.map((c, i) => (
        <a
          key={c.key}
          href={`/search?cat=${c.key}`}
          className="relative flex flex-col items-center gap-2 py-3 text-center text-xs text-gray-700"
        >
          <span className="relative h-10 w-10">
            <Image src={c.icon} alt={c.label} fill className="object-contain" />
          </span>

          <span>{c.label}</span>

          {i !== mockCategories.length - 1 && (
            <span className="absolute right-0 top-1/2 h-14 -translate-y-1/2 border-r border-gray-300" />
          )}
        </a>
      ))}
    </div>
  );
}