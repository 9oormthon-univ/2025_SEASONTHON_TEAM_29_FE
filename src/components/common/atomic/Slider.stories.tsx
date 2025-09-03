import type { Meta, StoryObj } from '@storybook/react';
import Slider from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Common/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    total: {
      control: { type: 'number', min: 1, max: 10 },
    },
    initialIndex: {
      control: { type: 'number', min: 0 },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    total: 5,
    initialIndex: 0,
  },
};

export const StartAtMiddle: Story = {
  args: {
    total: 7,
    initialIndex: 3,
  },
};
