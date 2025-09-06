'use client';

import SearchBar from '@/components/common/atomic/SearchBar';
import BannerSquareCarousel from '@/components/home/BannerSquareCarousel';
import CategoryQuick from '@/components/home/CategoryQuick';
import ReviewSquareCarousel from '@/components/home/ReviewSquareCarousel';
import StoryWideCarousel from '@/components/home/StoryWideCarousel';
import VendorSquareCarousel from '@/components/home/VendorSquareCarousel';
import { categories, reviews, stories } from '@/data/homeData';
import { useVendorsByCategory } from '@/hooks/useVendorsByCategory';
import { getEditorialBanners } from '@/lib/editorials';

export default function HomePage() {
  const banners = getEditorialBanners();

  // 실데이터: 메이크업 / 스튜디오
  const makeup = useVendorsByCategory('MAKEUP', 10);
  const studio = useVendorsByCategory('STUDIO', 10);

  return (
    <main className="w-full max-w-[420px] mx-auto px-[22px] pb-24">
      <SearchBar showCart={true}/>
      <BannerSquareCarousel items={banners} />
      <CategoryQuick items={categories}/>
      <ReviewSquareCarousel items={reviews}/>
      <StoryWideCarousel items={stories}/>

      <VendorSquareCarousel
        title="웨딧터가 고른 메이크업"
        items={makeup.items}
      />
      {makeup.loading && <p className="mt-2 text-xs text-text-secondary">메이크업 불러오는 중…</p>}
      {makeup.error && <p className="mt-2 text-xs text-red-500">{makeup.error}</p>}

      <VendorSquareCarousel
        title="지금 주목할 만한 스튜디오"
        items={studio.items}
      />
      {studio.loading && <p className="mt-2 text-xs text-text-secondary">스튜디오 불러오는 중…</p>}
      {studio.error && <p className="mt-2 text-xs text-red-500">{studio.error}</p>}
    </main>
  );
}