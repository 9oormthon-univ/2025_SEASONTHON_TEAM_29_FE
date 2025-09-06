// src/components/Mypage/ReviewsSection.tsx
'use client';
import SvgObject from '@/components/common/atomic/SvgObject';
import CompanyCard from '@/components/mypage/CompanyCard';
import type { ReviewCompany } from '@/types/mypage';

export default function ReviewsSection({
  items, loading, error, hasMore, onMore, onWriteClick, onCardClick, allowWrite = true,
}: {
  items: ReviewCompany[];
  loading?: boolean;
  error?: string;
  hasMore?: boolean;
  onMore: () => void;
  onWriteClick: () => void;
  onCardClick: (id: string) => void;
  /** 지난 예약이 있을 때만 작성 버튼 노출 */
  allowWrite?: boolean;
}) {
  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-1 text-[15px] font-medium text-text-default">
          <span>최신순</span>
          <SvgObject src="/icons/arrowDown.svg" alt="arrow-down" width={20} height={20} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {allowWrite && (
          <button
            type="button"
            onClick={onWriteClick}
            className="flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-lg text-text-secondary outline-1 outline-box-line outline-offset-[-1px]"
          >
            <SvgObject src="/icons/plus.svg" alt="plus" width={26} height={26} className="rounded-full" />
            <span>후기작성</span>
          </button>
        )}

        {items.map((c) => (
          <CompanyCard
            key={c.id}
            variant="review"
            region={c.district ?? '-'}
            name={c.name}
            imageSrc={c.imageSrc}
            rating={c.rating}
            onClick={() => onCardClick(c.id)}
          />
        ))}
      </div>

      {loading && (
        <div className="mt-4 grid gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-md bg-gray-100" />
          ))}
        </div>
      )}
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="mt-3 text-sm text-text-secondary">작성한 후기가 없습니다.</p>
      )}
      {!loading && hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="h-10 rounded-lg px-4 text-sm outline-1 outline-box-line"
            onClick={onMore}
          >
            더 보기
          </button>
        </div>
      )}
    </div>
  );
}