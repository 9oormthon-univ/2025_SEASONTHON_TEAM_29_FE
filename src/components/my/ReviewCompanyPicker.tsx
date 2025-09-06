'use client';

import { labelFromISODate } from '@/services/mypage.api';
import type { MyReservation } from '@/types/mypage';
import Image from 'next/image';

// ✅ 서울 기준 YYYY-MM-DD
function todayYMDSeoul(): string {
  const now = new Date();
  const y = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', year: 'numeric' }).format(now);
  const m = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', month: '2-digit' }).format(now);
  const d = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', day: '2-digit' }).format(now);
  return `${y}-${m}-${d}`;
}
function isPastYMDSeoul(ymd: string): boolean {
  const today = todayYMDSeoul();
  return /^\d{4}-\d{2}-\d{2}$/.test(ymd) ? ymd < today : false;
}

export default function ReviewCompanyPicker({
  reservations,
  loading,
  error,
  onPick,
}: {
  reservations: MyReservation[];
  loading?: boolean;
  error?: string;
  onPick: (query: {
    vendorId: string;
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

  // ✅ 지난 예약만 추출
  const pastReservations = reservations.filter(r => isPastYMDSeoul(r.reservationDate));

  if (pastReservations.length === 0)
    return <p className="mt-3 text-sm text-text-secondary">지난 예약이 아직 없어요.</p>;

  return (
    <ul className="mt-3 max-h-[60vh] overflow-y-auto rounded-md border border-gray-100">
      {pastReservations
        .slice()
        .sort((a, b) => b.reservationDate.localeCompare(a.reservationDate))
        .map((r) => {
          const vendorName = r.vendorName ?? `업체 #${r.vendorId}`;
          const logo = r.vendorLogoUrl || r.mainImageUrl || '/logos/placeholder.png';
          const when = `${labelFromISODate(r.reservationDate)} ${r.reservationTime || ''}`.trim();

          return (
            <li key={r.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50"
                onClick={() =>
                  onPick({
                    vendorId: String(r.vendorId),
                    vendorName,
                    reservationId: String(r.id),
                    date: r.reservationDate,
                    time: r.reservationTime,
                  })
                }
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={logo}
                    alt={vendorName}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-md object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{vendorName}</span>
                    <span className="text-xs text-text-secondary">{when}</span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
    </ul>
  );
}