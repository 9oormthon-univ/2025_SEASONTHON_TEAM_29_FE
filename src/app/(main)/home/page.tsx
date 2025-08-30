import SearchBar from "@/components/common/atomic/SearchBar";
import BannerSquareCarousel from "@/components/home/BannerSquareCarousel";
import CategoryQuick from "@/components/home/CategoryQuick";
import ReviewSquareCarousel from "@/components/home/ReviewSquareCarousel";


export default function HomePage() {
  return (
    <main className="pb-24">
      <SearchBar/>
      <BannerSquareCarousel />
      <CategoryQuick/>
      <ReviewSquareCarousel/>
      {/* 스토리 */}
      {/* 벤더 */}
    </main>
  );
}