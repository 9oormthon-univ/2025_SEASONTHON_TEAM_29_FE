import type { Meta, StoryObj } from '@storybook/react';
import CompanyCard from './CompanyCard';

const meta: Meta<typeof CompanyCard> = {
  title: 'mypage/CompanyCard',
  component: CompanyCard,
  tags: ['autodocs'],
  args: {
    region: '선릉',
    name: '그레이스케일',
    imageSrc: 'https://placehold.co/108x108',
  },
  decorators: [(Story) => <Story />],
};
export default meta;

type Story = StoryObj<typeof CompanyCard>;
export const Default: Story = {};
