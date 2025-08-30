import SearchBar from "@/components/common/atomic/SearchBar";
import BannerSquareCarousel from "@/components/home/BannerSquareCarousel";
import CategoryQuick from "@/components/home/CategoryQuick";
import ReviewSquareCarousel from "@/components/home/ReviewSquareCarousel";
import StoryWideCarousel from "@/components/home/StoryWideCarousel";
import { banners, categories, reviews, stories } from "@/data/homeData";


export default function HomePage() {
  return (
    <main className="pb-24">
      <SearchBar/>
      <BannerSquareCarousel items={banners}/>
      <CategoryQuick items={categories}/>
      <ReviewSquareCarousel items={reviews}/>
      <StoryWideCarousel items={stories}/>
      {/* 벤더 */}
    </main>
  );
}