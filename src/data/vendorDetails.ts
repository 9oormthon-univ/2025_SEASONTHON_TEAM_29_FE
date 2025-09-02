// src/data/vendorDetails.ts
import type { VendorDetail } from '@/types/vendor';

export const vendorDetails: VendorDetail[] = [
  {
    id: 1,
    title: '아펠가모 선릉점',
    category: '웨딩홀',
    followers: 470,
    reviews: 180,
    phone: "010-1234-5678",
    mapurl: "https://place.map.kakao.com/189758970",
    detail: "웨딩홀 180석, 피로연장 470석 보유",
    description: "쏟아지는 환호, 반짝이는 행복, 두 사람의 힘찬 첫 걸음. 아펠가모는 버진로드 위를 함께 걷는 두 사람의 ‘행진’을 뜻합니다. 품격 있는 채플 웨딩 스타일을 선도해 온 아펠가모. 단순한 웨딩 홀의 개념을 넘어 경건하고 성스러운 예식의 가치에 오감을 만족시킬 미식과 품격 있는 스타일을 더해 삶 속에서 가장 빛나는 순간을 선사하겠습니다.",
    mainImage: '/vendors/apelgamo/main.jpg',
    places: [
      {
        name: 'Wedding Hall',
        images: ['/vendors/apelgamo/hall1.jpg', '/vendors/apelgamo/hall2.jpg'],
        description: '도심 속에서 누리는 가장 스타일리쉬한 웨딩. 기억하고 싶은 단 한번의 클라이맥스는 아펠가모와 함께한 바로 그 순간이 될 것입니다.',
      },
      {
        name: 'Bridal Room',
        images: ['/vendors/apelgamo/bridal1.jpg'],
      },
      {
        name: 'Buffet & Banquet',
        images: ['/vendors/apelgamo/buffet1.jpg'],
      },
    ],
  },
];