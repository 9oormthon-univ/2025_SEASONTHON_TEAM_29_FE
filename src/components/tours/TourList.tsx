'use client';

import type { ToursBundle, TourTab } from '@/types/tour';

export default function TourList({
  tab,
  data,
}: {
  tab: TourTab;
  data: ToursBundle;
}) {
  if (tab === 'dressTour') {
    return (
      <ul className="divide-y">
        {data.dressTour.map((it) => (
          <li key={it.id} className="flex items-center gap-3 px-4 py-4">
            <img src={it.logoUrl} alt="" className="h-10 w-10 rounded object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium">{it.brandName}</p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                it.status === 'PENDING'
                  ? 'bg-rose-100 text-rose-500'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {it.status === 'PENDING' ? '기록 대기' : '기록 완료'}
            </span>
            <svg className="ml-3 h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707A1 1 0 018.707 5.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="divide-y">
      {data.dressRomance.map((it) => (
        <li key={it.id} className="flex items-center gap-3 px-4 py-4">
          <img src={it.logoUrl} alt="" className="h-10 w-10 rounded object-cover" />
          <div className="flex-1">
            <p className="text-sm font-medium">{it.brandName}</p>
            {it.memo && <p className="mt-0.5 text-xs text-gray-400">{it.memo}</p>}
          </div>
          <svg className="ml-3 h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707A1 1 0 018.707 5.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
        </li>
      ))}
    </ul>
  );
}