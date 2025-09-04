import type { Meta, StoryObj } from '@storybook/nextjs';
import ReservationButton from './ReservationButton';

const meta: Meta<typeof ReservationButton> = {
  title: 'reservation/ReservationButton',
  component: ReservationButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['default', 'primary'],
    },
    children: { control: 'text' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof ReservationButton>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: '상담 예약하기',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '상담 예약하기',
  },
};
