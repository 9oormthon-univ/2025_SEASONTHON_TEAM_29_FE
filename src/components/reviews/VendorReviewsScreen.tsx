// src/components/reviews/VendorReviewsScreen.tsx
'use client';

import Header from '@/components/common/monocules/Header';
import ReviewSortTabs, { toSortParam } from '@/components/reviews/ReviewSortTabs';
import VendorReviewCard from '@/components/reviews/VendorReviewCard';
import VendorReviewStats from '@/components/reviews/VendorReviewStats';
import { useVendorReviews } from '@/hooks/useVendorReviews';
import { getVendorReviewStats, type VendorReviewStatsType } from '@/services/vendor-review.api';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function VendorReviewsScreen({ vendorId }: { vendorId: number }) {
  const [stats, setStats] = useState<VendorReviewStatsType | null>(null);
  const [sortKey, setSortKey] = useState<'high' | 'low'>('high');
  const sortParam = useMemo(() => toSortParam(sortKey), [sortKey]);

  const { items, hasNext, loading, load } = useVendorReviews(vendorId, 6, sortParam);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 통계 1회 로드
  useEffect(() => {
    (async () => {
      const s = await getVendorReviewStats(vendorId);
      setStats(s); // ✅ 그대로 저장
    })();
  }, [vendorId]);

  // 첫 페이지 & 무한 스크롤
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortParam]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      (ents) => {
        const first = ents[0];
        if (first.isIntersecting) load();
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [load]);
  const router = useRouter();

  return (
    <main className="mx-auto min-h-screen w-full max-w-[420px] bg-white pb-16">
      <Header showBack value="전체리뷰" onBack={() => router.back()}/>

      {/* 상단: 총 개수 텍스트 */}
      <section className="px-5 pt-3">
        {stats && (
          <p className="text-[15px]">
            총 <span className="font-semibold text-primary-500">{stats.totalCount}개</span>의 후기가 있어요.
          </p>
        )}
      </section>

      {/* 통계 카드 */}
      {stats && (
        <section className="px-5 pt-3">
          <VendorReviewStats
            totalCount={stats.totalCount}
            averageRating={stats.averageRating}
            dist={stats.ratingDistribution} // ✅ 올바른 키 전달
          />
        </section>
      )}

      {/* 정렬 탭 */}
      <section className="px-5">
        <ReviewSortTabs value={sortKey} onChange={setSortKey} />
      </section>

      {/* 리뷰 리스트 */}
      <section className="mt-4 space-y-8 px-5">
        {items.map((r) => (
          <VendorReviewCard key={r.reviewId} r={r} />
        ))}
        {/* 로딩 스켈레톤 */}
        {loading && (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        )}
        {/* 무한 스크롤 센티널 */}
        {hasNext && <div ref={sentinelRef} className="h-8" />}
      </section>
    </main>
  );
}