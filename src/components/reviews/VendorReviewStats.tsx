// src/components/reviews/VendorReviewStats.tsx
'use client';

import type { RatingDist } from '@/services/vendor-review.api';

export default function VendorReviewStats({
  totalCount,
  averageRating,
  dist,
}: {
  totalCount: number;
  averageRating: number;
  dist: RatingDist;
}) {
  const safeTotal = Math.max(1, totalCount);
  const rows = [5, 4, 3, 2, 1] as const;

  // 그래프 최대 막대 높이(px)
  const BAR_MAX = 60;

  return (
    <section className="rounded-2xl border border-box-line p-4 flex items-center h-28">
      {/* 왼쪽: 웨딧링 점수 */}
      <div className="flex ml-8 flex-col items-start">
        <span className="text-base font-bold text-gray-800">웨딧링</span>
        <span className="mt-1 text-xl font-medium text-primary-500">
          {averageRating.toFixed(1)}점
        </span>
      </div>

      {/* 오른쪽: 세로 막대 그래프 (라벨 하단 고정) */}
      <div className="ml-auto flex items-end gap-4 mr-5">
        {rows.map((score) => {
          const count = dist[String(score) as keyof RatingDist] ?? 0;
          const ratio = count / safeTotal;
          const h = count === 0 ? 0 : Math.max(4, Math.round(BAR_MAX * ratio)); // 최소 4px 보장

          return (
            <div key={score} className="flex flex-col items-center">
              {/* 막대 영역은 고정 높이 */}
              <div className="h-[60px] flex items-end">
                <div
                  className="w-2 bg-primary-400 rounded-t"
                  style={{ height: `${h}px` }}
                />
              </div>
              {/* 라벨은 항상 아래 동일 위치 */}
              <span className="mt-1 text-xs text-text-secondary">{score}점</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}