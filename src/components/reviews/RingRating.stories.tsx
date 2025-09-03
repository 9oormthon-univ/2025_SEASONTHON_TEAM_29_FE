import type { Meta, StoryObj } from '@storybook/react';
import RingRating from './RingRating';

const meta: Meta<typeof RingRating> = {
  title: 'reviews/RingRating',
  component: RingRating,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RingRating>;

export const Default: Story = {};

export const WithInitialValue: Story = {
  args: {
    value: 4,
  },
};
