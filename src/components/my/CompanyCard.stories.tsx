import type { Meta, StoryObj } from '@storybook/react';
import CompanyCard from './CompanyCard';

const meta: Meta<typeof CompanyCard> = {
  title: 'Components/CompanyCard',
  component: CompanyCard,
  argTypes: {
    variant: {
      control: 'select',
      options: ['cart', 'review', 'category'],
    },
    category: {
      control: 'select',
      options: ['스튜디오', '웨딩홀', '드레스', '메이크업'],
    },
    selected: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CompanyCard>;

export const Cart: Story = {
  args: {
    variant: 'cart',
    name: '아펠가모',
    region: '공덕',
    imageSrc: 'https://placehold.co/118x118',
    priceText: '1065만원',
    category: '드레스',
    executionDateTime: '2026-04-11',
    selected: true,
  },
};

export const Review: Story = {
  args: {
    variant: 'review',
    name: '아펠가모',
    region: '공덕',
    imageSrc: 'https://placehold.co/118x118',
    rating: { score: 4.7, count: 123 },
  },
};

export const Category: Story = {
  args: {
    variant: 'category',
    name: '아펠가모',
    region: '공덕',
    imageSrc: 'https://placehold.co/118x118',
    rating: { score: 4.5 },
    priceText: '1065만원',
  },
};
