import type { Meta, StoryObj } from '@storybook/react';
import InvitationHeader from './InvitationHeader';

const meta: Meta<typeof InvitationHeader> = {
  title: 'Invitation/InvitationHeader',
  component: InvitationHeader,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-90">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    year: { control: 'number' },
    month: { control: { type: 'number', min: 1, max: 12 } },
    day: { control: { type: 'number', min: 1, max: 31 } },
  },
};
export default meta;

type Story = StoryObj<typeof InvitationHeader>;

export const Default: Story = {
  args: { year: 2026, month: 5, day: 16 },
};

export const CustomDate: Story = {
  args: { year: 2025, month: 10, day: 3 },
};

export const WithClassName: Story = {
  args: { year: 2026, month: 5, day: 16, className: 'px-8 py-10' },
};
