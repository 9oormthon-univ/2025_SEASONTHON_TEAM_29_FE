'use client';

import { CategoryItem } from '@/types/category';
import { cn } from '@/utills/cn';
import SvgObject from '../common/atomic/SvgObject';

export default function CategoryQuick({
  items,
  bgColor = 'gray',
}: {
  items: CategoryItem[];
  bgColor?: 'gray' | 'white';
}) {
  return (
    <div
      className={cn(
        'mt-5 grid grid-cols-4 gap-2 rounded-xl',
        bgColor === 'gray' ? 'bg-gray-100' : 'bg-white',
      )}
    >
      {items.map((c, i) => (
        <a
          key={c.key}
          href={`/category/detail?cat=${c.key}`}
          className="relative flex flex-col items-center gap-2 py-3 text-center text-xs text-gray-700"
        >
          <div className="h-10 w-10">
            <SvgObject src={c.icon} alt={c.label} className="h-full w-full" />
          </div>

          <span>{c.label}</span>

          {i !== items.length - 1 && (
            <span className="absolute right-0 top-1/2 h-14 -translate-y-1/2 border-r border-gray-300" />
          )}
        </a>
      ))}
    </div>
  );
}
