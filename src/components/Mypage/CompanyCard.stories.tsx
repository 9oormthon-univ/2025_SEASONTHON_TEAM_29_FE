import type { Meta, StoryObj } from '@storybook/react';
import CompanyCard from './CompanyCard';

const meta: Meta<typeof CompanyCard> = {
  title: 'mypage/CompanyCard',
  component: CompanyCard,
  tags: ['autodocs'],
  args: {
    region: '선릉',
    name: '그레이스케일',
    imageSrc: 'https://placehold.co/112x112',
    priceText: '124만원~',
  },
};
export default meta;

type Story = StoryObj<typeof CompanyCard>;

export const Review: Story = {
  args: {
    variant: 'review',
    region: '압구정',
    name: '정샘물',
    imageSrc: 'https://placehold.co/106x26',
    rating: { score: 4.8 },
  },
};

export const Category: Story = {
  args: {
    variant: 'category',
    region: '광주',
    name: '노블스튜디오',
    imageSrc: 'https://placehold.co/112x112',
    rating: { score: 4.8, count: 164 },
    priceText: '124만원~',
    category: '드레스',
  },
};
