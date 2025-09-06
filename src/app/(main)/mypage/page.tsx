// src/app/mypage/page.tsx
'use client';

import BottomNav from '@/components/common/atomic/BottomNav';
import Header from '@/components/common/monocules/Header';
import BottomSheet from '@/components/mypage/CompanyModal';
import DdayCard from '@/components/mypage/D-dayCheck';
import ProfileHeader from '@/components/mypage/ProfileHeader';
import ReservationsSection from '@/components/mypage/ReservationsSection';
import ReviewCompanyPicker from '@/components/mypage/ReviewCompanyPicker';
import ReviewsSection from '@/components/mypage/ReviewsSection';
import { useMyProfile } from '@/hooks/useMyProfile';
import { useMyReservations } from '@/hooks/useMyReservations';
import { useMyReviews } from '@/hooks/useMyReviews';
import { resolveWeddingTarget } from '@/services/mypage.api';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

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

export default function Page() {
  const [tab, setTab] = useState<'reserve' | 'review'>('reserve');
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data: profile, loading: profLoading, error: profErr } = useMyProfile();
  const { data: reservations, loading: resLoading, error: resErr } = useMyReservations();
  const { items: reviews, loading: revLoading, error: revErr, hasMore, loadMore } = useMyReviews(9);

  const profileTarget = useMemo(
    () => resolveWeddingTarget(profile?.weddingDay) ?? '2026-05-10',
    [profile?.weddingDay],
  );

  const router = useRouter();

  const hasPastReservation = useMemo(
    () => reservations.some(r => isPastYMDSeoul(r.reservationDate)),
    [reservations],
  );

  // ✅ 피커에는 "지난 예약"만 전달
  const pastOnlyReservations = useMemo(
    () => reservations.filter(r => isPastYMDSeoul(r.reservationDate)),
    [reservations],
  );

  return (
    <main className="min-h-screen bg-background pb-24">
      <Header value="마이" />
      <section className="mx-auto max-w-96 px-5 pt-2">
        <ProfileHeader
          loading={profLoading}
          error={profErr}
          name={profile?.name}
          type={profile?.type}
          partnerName={profile?.partnerName}
          coupled={profile?.coupled}
        />

        <DdayCard target={profileTarget} className="mx-auto h-36 w-80" />

        <div className="mt-6 flex gap-6">
          <button onClick={() => setTab('reserve')} className={tab === 'reserve' ? 'border-b-2' : ''}>
            내 예약
          </button>
          <button onClick={() => setTab('review')} className={tab === 'review' ? 'border-b-2' : ''}>
            후기
          </button>
        </div>

        {tab === 'reserve' ? (
          <ReservationsSection items={reservations} loading={resLoading} error={resErr} vendorMap={{}} />
        ) : (
          <ReviewsSection
            items={reviews}
            loading={revLoading}
            error={revErr ?? undefined}
            hasMore={hasMore}
            onMore={loadMore}
            onWriteClick={() => setSheetOpen(true)}
            onCardClick={(id) => router.push(`/review/${id}`)}
            allowWrite={hasPastReservation} // ✅ 지난 예약이 없으면 버튼 숨김
          />
        )}
      </section>
      <BottomNav innerMax="max-w-96" />
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <h3 className="px-1 text-base font-semibold text-foreground">업체 선택</h3>
        <ReviewCompanyPicker
          reservations={pastOnlyReservations}
          loading={resLoading}
          error={resErr ?? undefined}
          onPick={({ vendorId, vendorName, reservationId, date, time }) => {
            setSheetOpen(false);
            const q = new URLSearchParams({
              vendorId,
              vendorName: encodeURIComponent(vendorName),
              reservationId,
              date,
              time,
            }).toString();
            router.push(`/mypage/review?${q}`);
          }}
        />
      </BottomSheet>
    </main>
  );
}