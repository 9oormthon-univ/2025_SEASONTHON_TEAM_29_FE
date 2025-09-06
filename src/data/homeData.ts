import { CategoryItem } from "@/types/category";
import { ReviewItem } from "@/types/review";
import { StoryItem } from "@/types/story";
import { VendorItem } from "@/types/vendor";

export const categories: CategoryItem[] = [
    { key: 'hall', label: '웨딩홀', icon: '/icons/Category/weddinghall.svg' },
    { key: 'dress', label: '드레스', icon: '/icons/Category/dress.svg' },
    { key: 'studio', label: '스튜디오', icon: '/icons/Category/studio.svg' },
    { key: 'makeup', label: '메이크업', icon: '/icons/Category/makeup.svg' },
];

export const reviews: ReviewItem[] = [
  {
    id: 1,
    src: null,
    href: '#',
    alt: '아펠가모 반포 후기 이미지',
    category: '웨딩홀',
    title: '아펠가모 반포 이용후기',
    rings: 4,
  },
  {
    id: 2,
    src: null,
    href: '#',
    alt: '바로오늘이그날 후기 이미지',
    category: '스튜디오',
    title: '바로오늘이그날 후기',
    rings: 5,
  },
  {
    id: 3,
    src: null,
    href: '#',
    alt: '미르스튜디오 후기 이미지',
    category: '스튜디오',
    title: '미르스튜디오 최고',
    rings: 5,
  },
  {
    id: 4,
    src: null,
    href: '#',
    alt: '정현정 파라팜 후기 이미지',
    category: '스튜디오',
    title: '정현정 파라팜 후기',
    rings: 3,
  },
  {
    id: 5,
    src: null,
    href: '#',
    alt: '아펠가모 선릉 후기 이미지',
    category: '웨딩홀',
    title: '아펠가모 선릉',
    rings: 5,
  },
];

export const stories: StoryItem[] = [
  { id: 1, category: ['본식드레스', '우아함'], title: '웨딧이 픽한 웨딩드레스', img: '/icons/story1.png' },
  { id: 2, category: ['야외', '로맨틱', '단독홀'], title: '신부 취향저격 가든웨딩', img: '/icons/story2.png' },
];

export const makeupVendors: VendorItem[] = [
  { id:1, name:'겐그레아', region:'청담', rating:4.6, count:219, price: 100_000, logo:'/home/vendor/makeup/thumbnail1.png', href:'#' },
  { id:2, name:'정샘물', region:'압구정', rating:4.8, count:304, price: 100_000, logo:'/home/vendor/makeup/thumbnail2.png', href:'#' },
  { id:3, name:'제니하우스', region:'서초', rating:4.7, count:104, price: 100_000, logo:'/home/vendor/makeup/thumbnail3.png', href:'#' },
  { id:4, name:'김활란 뮤제네프', region:'청담', rating:4.4, count:184, price: 100_000, logo:'/home/vendor/makeup/thumbnail4.png', href:'#' },
  { id:5, name:'순수', region:'청담', rating:4.9, count:241, price: 100_000, logo:'/home/vendor/makeup/thumbnail5.png', href:'#' },
];

export const studioVendors: VendorItem[] = [
  { id:1, name:'그레이스케일', region:'선릉', rating:4.8, count:237, price: 100_000, logo:'/home/vendor/studio/thumbnail1.png', href:'#' },
  { id:2, name:'ST정우', region:'청담', rating:4.6, count:103, price: 100_000, logo:'/home/vendor/studio/thumbnail2.png', href:'#' },
  { id:3, name:'로렌하우스', region:'논현', rating:4.7, count:38, price: 100_000, logo:'/home/vendor/studio/thumbnail3.png', href:'#' },
  { id:4, name:'203사진관', region:'신림', rating:4.9, count:124, price: 100_000, logo:'/home/vendor/studio/thumbnail4.png', href:'#' },
  { id:5, name:'느와르 블랑하우스', region:'논현', rating:4.4, count:184, price: 100_000, logo:'/home/vendor/studio/thumbnail5.png', href:'#' },
];


export const hallVendors: VendorItem[] = [
  { id:1, name:'그레이스케일', region:'선릉', rating:4.8, count:237, price: 100_000, logo:'/home/vendor/studio/thumbnail1.png', href:'#' },
  { id:2, name:'ST정우', region:'청담', rating:4.6, count:103, price: 100_000, logo:'/home/vendor/studio/thumbnail2.png', href:'#' },
  { id:3, name:'로렌하우스', region:'논현', rating:4.7, count:38, price: 100_000, logo:'/home/vendor/studio/thumbnail3.png', href:'#' },
  { id:4, name:'203사진관', region:'신림', rating:4.9, count:124, price: 100_000, logo:'/home/vendor/studio/thumbnail4.png', href:'#' },
  { id:5, name:'느와르 블랑하우스', region:'논현', rating:4.4, count:184, price: 100_000, logo:'/home/vendor/studio/thumbnail5.png', href:'#' },
];