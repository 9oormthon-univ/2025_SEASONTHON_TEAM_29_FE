import type { Meta, StoryObj } from '@storybook/react';
import CompanyLongCard from './CompanyLongCard';

const meta: Meta<typeof CompanyLongCard> = {
  title: 'reviews/CompanyLongCard',
  component: CompanyLongCard,
  tags: ['autodocs'],
  args: {
    type: '웨딩홀',
    title: '아펠가모',
    date: '2025.08.31',
    logoUrl: 'https://placehold.co/66x66',
  },
};

export default meta;
type Story = StoryObj<typeof CompanyLongCard>;

export const Default: Story = {};

export const WithReportHandler: Story = {
  args: {
    onReport: () => alert('신고하기 클릭!'),
  },
};
