import type { Meta, StoryObj } from '@storybook/react';
import ReservationCard from './ReservationCard';

const meta: Meta<typeof ReservationCard> = {
  title: 'reservation/ReservationCard',
  component: ReservationCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['white', 'pink'],
    },
    selected: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
};
export default meta;

type Story = StoryObj<typeof ReservationCard>;

export const White: Story = {
  args: {
    date: '26.06.07 일요일 11:00',
    hallFee: '6,380,000원',
    minGuests: '210명',
    mealFee: '14,784,000원',
    variant: 'white',
    selected: false,
  },
};

export const Pink: Story = {
  args: {
    date: '26.06.07 일요일 11:00',
    hallFee: '6,380,000원',
    minGuests: '210명',
    mealFee: '14,784,000원',
    variant: 'pink',
    selected: false,
  },
};
