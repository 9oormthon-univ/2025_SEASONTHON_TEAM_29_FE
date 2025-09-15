// src/components/invitation/MainImage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import MainImage from './MainImage';

const meta: Meta<typeof MainImage> = {
  title: 'Invitation/MainImage',
  component: MainImage,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
    nextjs: { appDirectory: true },
  },
  argTypes: {
    src: { control: 'text' },
    className: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof MainImage>;

export const Default: Story = {
  args: {},
};
