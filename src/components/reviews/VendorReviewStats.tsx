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
  const rows = [5, 4, 3, 2, 1] as const;
  const BAR_MAX = 60;

  return (
    <section className="rounded-2xl border border-box-line p-4 flex items-center h-28">
      {/* 왼쪽: 웨딧링 점수 */}
      <div className="flex ml-8 flex-col items-center">
        <span className="text-base font-bold text-gray-800">웨딧링</span>
        <span className="text-xl font-medium text-primary-500">
          {averageRating.toFixed(1)}점
        </span>
      </div>

      {/* 오른쪽: 세로 막대 그래프 */}
      <div className="ml-auto flex items-end gap-4 mr-5">
        {rows.map((score) => {
          const count = dist[String(score) as keyof RatingDist] ?? 0;

          // totalCount가 0일 때는 막대 높이 0
          const ratio = totalCount > 0 ? count / totalCount : 0;
          const h = count === 0 ? 0 : Math.max(4, Math.round(BAR_MAX * ratio));

          return (
            <div key={score} className="flex flex-col items-center">
              <div className="h-[60px] flex items-end">
                <div
                  className="w-2 bg-primary-400 rounded-t"
                  style={{ height: `${h}px` }}
                />
              </div>
              <span className="mt-1 text-xs text-text-secondary">{score}점</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}