import type { Meta, StoryObj } from '@storybook/react';
import InvitationCast from './InvitationCast';

const meta: Meta<typeof InvitationCast> = {
  title: 'Invitation/InvitationCast',
  component: InvitationCast,
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    groomName: { control: 'text' },
    brideName: { control: 'text' },
    groomFatherName: { control: 'text' },
    groomMotherName: { control: 'text' },
    brideFatherName: { control: 'text' },
    brideMotherName: { control: 'text' },
    className: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof InvitationCast>;

export const Default: Story = {
  args: {
    groomName: '윤하준',
    brideName: '박지안',
    groomFatherName: '윤상철',
    groomMotherName: '최미정',
    brideFatherName: '박종태',
    brideMotherName: '김영주',
  },
};
