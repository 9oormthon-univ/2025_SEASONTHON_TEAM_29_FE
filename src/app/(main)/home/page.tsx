import SearchBar from "@/components/common/atomic/SearchBar";
import BannerSquareCarousel from "@/components/home/BannerSquareCarousel";
import CategoryQuick from "@/components/home/CategoryQuick";
import ReviewSquareCarousel from "@/components/home/ReviewSquareCarousel";
import StoryWideCarousel from "@/components/home/StoryWideCarousel";
import VendorSquareCarousel from "@/components/home/VendorSquareCarousel";
import { categories, makeupVendors, reviews, stories, studioVendors } from "@/data/homeData";
import { getEditorialBanners } from "@/lib/editorials";


export default function HomePage() {
  const banners = getEditorialBanners();
  return (
    <main className="w-full max-w-[420px] mx-auto px-[22px] pb-24">
      <SearchBar showCart={true}/>
      <BannerSquareCarousel items={banners} />
      <CategoryQuick items={categories}/>
      <ReviewSquareCarousel items={reviews}/>
      <StoryWideCarousel items={stories}/>
      <VendorSquareCarousel title="웨딧터가 고른 메이크업" items={makeupVendors} />
      <VendorSquareCarousel title="지금 주목할 만한 스튜디오" items={studioVendors} />
    </main>
  );
}