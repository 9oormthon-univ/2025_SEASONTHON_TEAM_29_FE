'use client';

import { labelFromISODate, pickVendorLogo } from '@/services/mypage.api';
import type { MyReservation, VendorItem } from '@/types/mypage';
import CompanyCard from './CompanyCard';

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

export default function ReservationsSection({
  items,
  loading,
  error,
  vendorMap,
}: {
  items: MyReservation[];
  loading: boolean;
  error: string | null;
  vendorMap: Record<string, VendorItem>;
}) {
  const grouped = (() => {
    const m = new Map<string, MyReservation[]>();
    for (const r of items) {
      const list = m.get(r.reservationDate);
      if (list) list.push(r);
      else m.set(r.reservationDate, [r]);
    }
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  })();

  return (
    <div className="mt-4 space-y-6">
      {loading && <p>로딩중…</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && grouped.length === 0 && <p>예약 내역이 없습니다.</p>}

      {grouped.map(([date, list]) => (
        <div key={date}>
          <div className="mb-2 font-medium">{labelFromISODate(date)}</div>

          <div className="grid grid-cols-3 gap-3">
            {list.map((r) => {
              const past = isPastYMDSeoul(r.reservationDate);
              const name = r.vendorName ?? `업체 #${r.vendorId}`;
              const logo = pickVendorLogo(vendorMap[String(r.vendorId)], r);

              return (
                <CompanyCard
                  key={r.id}
                  region={r.district ?? '-'}
                  name={name}
                  imageSrc={logo}
                  /** 지난 예약이면 이미지 위만 덮기 */
                  dimImage={past}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}