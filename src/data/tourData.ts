import type { DressRomanceItem, DressTourItem } from '@/types/tour';

export const MOCK_DRESS_TOUR: DressTourItem[] = [
  { id: 'rt-1', brandName: '렌느 브라이덜', logoUrl: '/images/brand/rene.png',  status: 'PENDING' },
  { id: 'rt-2', brandName: '조슈아벨',       logoUrl: '/images/brand/josua.png', status: 'DONE' },
];

export const MOCK_DRESS_ROMANCE: DressRomanceItem[] = [
  { id: 'rm-1', brandName: '로망 A', logoUrl: '/images/brand/a.png', memo: '미카도 실크 라인' },
  { id: 'rm-2', brandName: '로망 B', logoUrl: '/images/brand/b.png' },
];