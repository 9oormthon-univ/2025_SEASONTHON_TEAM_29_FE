export type VendorItem = {
  id: number;
  name: string;
  region: string;
  rating: number;
  count: number;
  logo: string;
  href: string;
  price: number;
};

export type PlaceSection = {
  name: string;
  images: string[];
  description?: string;
};

export type VendorDetail = {
  id: number;
  title: string;        // 아펠가모 선릉
  category: string;     // 웨딩홀
  followers: number;
  reviews: number;
  detail: string;
  description: string;  // 상단 요약 설명
  mainImage: string;
  places: PlaceSection[];
  phone: string;
  mapurl: string;
};