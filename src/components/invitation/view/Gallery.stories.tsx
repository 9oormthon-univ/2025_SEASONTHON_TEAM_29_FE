import type { Meta, StoryObj } from '@storybook/react';
import Gallery from './Gallery';

const meta: Meta<typeof Gallery> = {
  title: 'Invitation/Gallery',
  component: Gallery,
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  argTypes: {
    perPage: { control: 'number' },
    total: { control: 'number' },
    showHint: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Gallery>;

const mockImgs = Array.from({ length: 30 }, () => '/mock/main-sample.jpg');

export const Default: Story = {
  args: {
    images: mockImgs.slice(0, 9),
    perPage: 9,
    total: 27,
    showHint: true,
  },
};

export const PartialFilled: Story = {
  args: {
    images: mockImgs.slice(0, 4),
    perPage: 9,
    total: 27,
  },
};

export const MultiPage: Story = {
  args: {
    images: mockImgs.slice(0, 20),
    perPage: 9,
    total: 27,
  },
};

export const Empty: Story = {
  args: {
    images: [],
    perPage: 9,
    total: 27,
  },
};
