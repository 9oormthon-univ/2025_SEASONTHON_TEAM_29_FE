import type { Meta, StoryObj } from '@storybook/react';
import ReservationIdCard from './ReservationIdCard';

const meta: Meta<typeof ReservationIdCard> = {
  title: 'reservation/ReservationIdCard',
  component: ReservationIdCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    address: { control: 'text' },
    dateTime: { control: 'text' },
    imageSrc: { control: 'text' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof ReservationIdCard>;

export const Default: Story = {
  args: {
    title: '제니하우스',
    address: '서초구 반포동 90-10 2층',
    dateTime: '8월 30일 A.M.10',
  },
};

export const WithImage: Story = {
  args: {
    title: '제니하우스',
    address: '서초구 반포동 90-10 2층',
    dateTime: '8월 30일 A.M.10',
    imageSrc:
      'https://img.freepik.com/premium-photo/abstract-background-design-hd-olive-green-color_851755-74064.jpg?semt=ais_hybrid&w=740&q=80',
  },
};
