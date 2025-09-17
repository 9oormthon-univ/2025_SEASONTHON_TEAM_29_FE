// src/components/my/ReviewCompanyPicker.tsx
'use client';

import Image from 'next/image';

export type PickCompany = {
  id: number;                 // contractId
  contractId: number;
  vendorName: string;
  vendorLogoUrl?: string;
  mainImageUrl?: string;
  reservationDate?: string;   // 표기용(없어도 됨)
  reservationTime?: string;   // 표기용(없어도 됨)
};

export default function ReviewCompanyPicker({
  items,
  loading,
  error,
  onPick,
}: {
  items: PickCompany[];
  loading?: boolean;
  error?: string;
  onPick: (query: {
    contractId: string;
    vendorName: string;
    reservationId: string;
    date: string;
    time: string;
  }) => void;
}) {
  if (loading) {
    return (
      <div className="grid gap-2 mt-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-gray-100" />
        ))}
      </div>
    );
  }
  if (error) return <p className="mt-3 text-sm text-red-500">{error}</p>;
  if (items.length === 0)
    return <p className="mt-3 text-sm text-text-secondary">후기 작성 가능한 계약이 없어요.</p>;

  return (
    <ul className="mt-3 max-h-[60vh] overflow-y-auto rounded-md">
      {items.map((r) => {
        const vendorName = r.vendorName;
        const logo = r.vendorLogoUrl || r.mainImageUrl || '/logos/placeholder.png';
        const when = r.reservationDate
          ? `${r.reservationDate}${r.reservationTime ? ` ${r.reservationTime}` : ''}`
          : '';

        return (
          <li key={r.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50"
              onClick={() =>
                onPick({
                  contractId: String(r.contractId),
                  vendorName,
                  reservationId: String(r.id),
                  date: r.reservationDate ?? '',
                  time: r.reservationTime ?? '',
                })
              }
            >
              <div className="flex items-center gap-2 border-b border-gray-200 pb-4 w-full">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <Image
                    src={logo}
                    alt={vendorName}
                    fill
                    className="object-contain"
                    sizes="40px"
                    draggable={false}
                    unoptimized
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-foreground">{vendorName}</span>
                  {when && <span className="text-xs text-text-secondary">{when}</span>}
                </div>
                <span aria-hidden className="rounded-full p-2 text-gray-400 ml-auto">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}