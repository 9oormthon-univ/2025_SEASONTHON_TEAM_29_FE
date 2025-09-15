// src/app/mypage/page.tsx
'use client';

import BottomNav from '@/components/common/atomic/BottomNav';
import Header from '@/components/common/monocules/Header';
import BottomSheet from '@/components/my/CompanyModal';
import DdayCard from '@/components/my/D-dayCheck';
import ProfileHeader from '@/components/my/ProfileHeader';
import ReviewCompanyPicker from '@/components/my/ReviewCompanyPicker';
import { useMyContracts } from '@/hooks/useMyContracts';
import { useMyProfile } from '@/hooks/useMyProfile';
import { useMyReviews } from '@/hooks/useMyReviews';
import { resolveWeddingTarget } from '@/services/mypage.api';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import ContractsTab from '@/components/my/ContractsTab';
import InviteCreateCard from '@/components/my/InviteCreateCard';
import MyTabs from '@/components/my/MyTabs';
import ReviewsTab from '@/components/my/ReviewsTab';
import { useReviewables } from '@/hooks/useReviewables';

export default function Page() {
  const [tab, setTab] = useState<'reserve' | 'review' | 'invite'>('reserve');
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: profile, loading: profLoading, error: profErr } = useMyProfile();
  const { data: contractsRes, loading: resLoading, error: resErr } = useMyContracts();
  const { items: reviews, loading: revLoading, error: revErr, hasMore, loadMore } = useMyReviews(9);
  const { items: reviewables, loading: rvLoading, error: rvErr } = useReviewables(50);

  const router = useRouter();

  const profileTarget = useMemo(
    () => resolveWeddingTarget(profile?.weddingDay) ?? '2026-05-10',
    [profile?.weddingDay],
  );

  return (
    <main className="min-h-screen bg-background pb-24">
      <Header showBack onBack={() => router.back()} value="마이" />

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

        <MyTabs value={tab} onChange={setTab} />

        {tab === 'reserve' && (
          <ContractsTab
            groups={contractsRes?.contractGroups ?? []}
            loading={resLoading}
            error={resErr}
          />
        )}

        {tab === 'review' && (
          <ReviewsTab
            items={reviews}
            loading={revLoading}
            error={revErr ?? undefined}
            hasMore={hasMore}
            onMore={loadMore}
            onWriteClick={() => setSheetOpen(true)}
            onCardClick={(id) => router.push(`/review/${id}`)}
            allowWrite
          />
        )}

        {tab === 'invite' && <InviteCreateCard />}
      </section>

      <BottomNav innerMax="max-w-96" />

      {/* 후기 작성 업체 선택 바텀시트 (reviewable 목록 활용) */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <h3 className="px-1 text-base font-semibold text-foreground">업체 선택</h3>
        <ReviewCompanyPicker
          items={reviewables.map((r) => ({
            id: r.contractId,
            vendorId: r.vendorId,
            vendorName: r.vendorName,
            vendorLogoUrl: r.logoImageUrl,
          }))}
          loading={rvLoading}
          error={rvErr ?? undefined}
          onPick={({ vendorId, vendorName, reservationId }) => {
            setSheetOpen(false);
            const q = new URLSearchParams({
              vendorId,
              vendorName,
              reservationId, // contractId
              date: '',
              time: '',
            }).toString();
            router.push(`/mypage/review?${q}`);
          }}
        />
      </BottomSheet>
    </main>
  );
}