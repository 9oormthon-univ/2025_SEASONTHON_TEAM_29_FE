'use client';

import SearchBar from '@/components/common/atomic/SearchBar';
import Up from '@/components/common/atomic/Up';
import BannerSquareCarousel from '@/components/home/BannerSquareCarousel';
import CategoryQuick from '@/components/home/CategoryQuick';
import Priced from '@/components/home/CostComponent';
import ReviewSquareCarousel from '@/components/home/ReviewSquareCarousel';
import StoryWideCarousel from '@/components/home/StoryWideCarousel';
import VendorSquareCarousel from '@/components/home/VendorSquareCarousel';
import { categories, stories } from '@/data/homeData';
import { useHomeReviews } from '@/hooks/useHomeReviews';
import { useVendorsByCategory } from '@/hooks/useVendorsByCategory';
import { getEditorialBanners } from '@/lib/editorials';

export default function HomePage() {
  const banners = getEditorialBanners();

  const makeup = useVendorsByCategory('MAKEUP', 5);
  const studio = useVendorsByCategory('STUDIO', 5);
  const reviews = useHomeReviews(10);

  return (
    <main className="w-full max-w-[420px] mx-auto px-[22px] pb-24">
      <SearchBar showCart={true} showNotification={true}/>
      <BannerSquareCarousel items={banners} />
      <CategoryQuick items={categories} />
      <Priced />
      {reviews.items.length > 0 && (
        <ReviewSquareCarousel items={reviews.items} />
      )}
      {reviews.loading && (
        <p className="mt-2 text-xs text-text-secondary">리뷰 불러오는 중…</p>
      )}
      {reviews.error && (
        <p className="mt-2 text-xs text-red-500">{reviews.error}</p>
      )}

      <StoryWideCarousel items={stories} />

      <VendorSquareCarousel
        title="웨딧터가 고른 메이크업"
        items={makeup.items}
      />
      {makeup.loading && (
        <p className="mt-2 text-xs text-text-secondary">
          메이크업 불러오는 중…
        </p>
      )}
      {makeup.error && (
        <p className="mt-2 text-xs text-red-500">{makeup.error}</p>
      )}

      <VendorSquareCarousel
        title="지금 주목할 만한 스튜디오"
        items={studio.items}
      />
      {studio.loading && (
        <p className="mt-2 text-xs text-text-secondary">
          스튜디오 불러오는 중…
        </p>
      )}
      {studio.error && (
        <p className="mt-2 text-xs text-red-500">{studio.error}</p>
      )}
      <Up />
    </main>
  );
}
