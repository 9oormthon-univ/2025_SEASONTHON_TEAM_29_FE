import SearchBar from "@/components/common/atomic/SearchBar";
import BannerSquareCarousel from "@/components/home/BannerSquareCarousel";
import CategoryQuick from "@/components/home/CategoryQuick";


export default function HomePage() {
  return (
    <main className="pb-24">
      <SearchBar/>
      <BannerSquareCarousel />
      <CategoryQuick/>
      {/* 리뷰 */}
      {/* 스토리 */}
      {/* 벤더 */}
    </main>
  );
}