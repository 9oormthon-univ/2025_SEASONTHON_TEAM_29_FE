// src/components/my/ReviewsTab.tsx
'use client';

import ReviewsSection from '@/components/my/ReviewsSection';
import type { ReviewCompany } from '@/types/mypage';

export default function ReviewsTab({
  items,
  loading,
  error,
  hasMore,
  onMore,
  onWriteClick,
  onCardClick,
  allowWrite,
  writeDisabled,
}: {
  items: ReviewCompany[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  onMore: () => void;
  onWriteClick: () => void;
  onCardClick: (id: string) => void;
  allowWrite: boolean;
  writeDisabled?: boolean;
}) {
  return (
    <ReviewsSection
      items={items}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onMore={onMore}
      onWriteClick={onWriteClick}
      onCardClick={onCardClick}
      allowWrite={allowWrite}
      writeDisabled={writeDisabled}
    />
  );
}