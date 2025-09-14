import type { Meta, StoryObj } from '@storybook/react';
import CompanyCard from './CompanyCard';
import type { ComponentProps } from 'react';

const meta = {
  title: 'Cards/CompanyCard',
  component: CompanyCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['category', 'review', 'cart'],
    },
    onClick: { action: 'clicked' },
  },
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof CompanyCard>;

export default meta;

type CardProps = ComponentProps<typeof CompanyCard>;
const IMG =
  'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=512&q=80&auto=format&fit=crop';

export const Category = {
  args: {
    variant: 'category',
    name: '라포레 스튜디오',
    region: '서울 강남',
    imageSrc: IMG,
    rating: { score: 4.8, count: 123 },
    priceText: '예상가 120만원~',
    dimImage: false,
    selected: false,
  } satisfies CardProps,
} satisfies StoryObj<typeof meta>;

export const Review = {
  args: {
    variant: 'review',
    name: '더화이트홀',
    region: '서울 강남',
    imageSrc: IMG,
    rating: { score: 4.6, count: 87 },
    dimImage: false,
  } satisfies CardProps,
} satisfies StoryObj<typeof meta>;

export const Cart = {
  args: {
    variant: 'cart',
    name: '메리드메이크업',
    region: '성수',
    imageSrc: IMG,
    priceText: '80만원',
    selected: false,
    dimImage: false,
  } satisfies CardProps,
} satisfies StoryObj<typeof meta>;

export const SelectedAndDimmed = {
  name: '선택 + 이미지 딤',
  args: {
    variant: 'category',
    name: '벨라 드레스',
    region: '서울 종로',
    imageSrc: IMG,
    rating: { score: 4.9, count: 201 },
    priceText: '150만원~',
    selected: true,
    dimImage: true,
  } satisfies CardProps,
} satisfies StoryObj<typeof meta>;

export const LongNameTruncation = {
  name: '긴 이름 / 트렁케이트 확인',
  args: {
    variant: 'category',
    name: '이름이아주아주긴스튜디오브랜드네임트렁케이트테스트',
    region: '경기 하남',
    imageSrc: IMG,
    rating: { score: 4.2, count: 9 },
    priceText: '70만원~',
  } satisfies CardProps,
} satisfies StoryObj<typeof meta>;
