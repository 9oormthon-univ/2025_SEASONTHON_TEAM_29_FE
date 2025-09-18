import { CategoryItem } from '@/types/category';
import { StoryItem } from '@/types/story';

export const categories: CategoryItem[] = [
  {
    key: 'hall',
    label: '웨딩홀',
    icon: '/icons/Category/weddinghall.svg',
    size: { w: 38.46, h: 40 },
    box: 42,
  },
  {
    key: 'dress',
    label: '드레스',
    icon: '/icons/Category/dress.svg',
    size: { w: 28, h: 45 },
    box: 44,
  },
  {
    key: 'studio',
    label: '스튜디오',
    icon: '/icons/Category/studio.svg',
    size: { w: 37, h: 28 },
    box: 43,
  },
  {
    key: 'makeup',
    label: '메이크업',
    icon: '/icons/Category/makeup.svg',
    size: { w: 26, h: 36 },
    box: 44,
  },
];

export const stories: StoryItem[] = [
  {
    id: 1,
    category: ['본식드레스', '우아함'],
    title: '웨딧이 픽한 웨딩드레스',
    img: '/icons/story1.png',
  },
  {
    id: 3,
    category: ['헤메', '로맨틱', '단독룸'],
    title: '신부들의 원픽 메이크업',
    img: '/icons/story2.png',
  },
];
