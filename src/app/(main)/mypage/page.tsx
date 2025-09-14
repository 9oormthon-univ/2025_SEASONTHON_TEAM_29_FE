// src/app/mypage/page.tsx
'use client';

import BottomNav from '@/components/common/atomic/BottomNav';
import Header from '@/components/common/monocules/Header';
import BottomSheet from '@/components/my/CompanyModal';
import DdayCard from '@/components/my/D-dayCheck';
import ProfileHeader from '@/components/my/ProfileHeader';
import ReviewCompanyPicker from '@/components/my/ReviewCompanyPicker';
import { useMyContracts } from '@/hooks/useMyContracts'; // ✅ 교체
import { useMyProfile } from '@/hooks/useMyProfile';
import { useMyReviews } from '@/hooks/useMyReviews';
import { isPastYMDSeoul } from '@/lib/dateKR';
import { resolveWeddingTarget } from '@/services/mypage.api';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import ContractsTab from '@/components/my/ContractsTab';
import InviteCreateCard from '@/components/my/InviteCreateCard';
import MyTabs from '@/components/my/MyTabs';
import ReviewsTab from '@/components/my/ReviewsTab';

export default function Page() {
  const [tab, setTab] = useState<'reserve' | 'review' | 'invite'>('reserve');
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: profile, loading: profLoading, error: profErr } = useMyProfile();
  const { data: contractsRes, loading: resLoading, error: resErr } = useMyContracts(); // ✅ 계약 데이터
  const { items: reviews, loading: revLoading, error: revErr, hasMore, loadMore } =
    useMyReviews(9);

  const router = useRouter();

  const profileTarget = useMemo(
    () => resolveWeddingTarget(profile?.weddingDay) ?? '2026-05-10',
    [profile?.weddingDay],
  );

  // 계약 목록 평탄화
  const contracts = useMemo(
    () => contractsRes?.contractGroups.flatMap((g) =>
      g.contracts.map((c) => ({ ...c, executionDate: g.executionDate })),
    ) ?? [],
    [contractsRes],
  );

  const hasPastContract = useMemo(
    () => contracts.some((c) => isPastYMDSeoul(c.executionDate)),
    [contracts],
  );

  const pastOnlyContracts = useMemo(
    () => contracts.filter((c) => isPastYMDSeoul(c.executionDate)),
    [contracts],
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
            allowWrite={hasPastContract}
          />
        )}

        {tab === 'invite' && <InviteCreateCard />}
      </section>

      <BottomNav innerMax="max-w-96" />

      {/* 후기 작성 업체 선택 바텀시트 */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <h3 className="px-1 text-base font-semibold text-foreground">업체 선택</h3>
        <ReviewCompanyPicker
          reservations={pastOnlyContracts.map((c) => ({
            id: c.contractId,
            vendorId: c.vendorId,
            vendorName: c.vendorName,
            reservationDate: c.executionDate,
            reservationTime: '',
            createdAt: '',
            updatedAt: '',
          }))}
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