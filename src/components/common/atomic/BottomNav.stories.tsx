import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import BottomNav, { BottomNavProps } from './BottomNav';

const meta: Meta<typeof BottomNav> = {
  title: 'common/BottomNav',
  component: BottomNav,
  parameters: { layout: 'fullscreen' },
  args: {
    pathname: '/home',
  },
  argTypes: {
    pathname: {
      control: { type: 'select' },
      options: ['/home', '/calendar', '/tours', '/mypage', '/etc'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof BottomNav>;

export const Playground: Story = {
  args: {
    pathname: '/home',
  },

  render: (args: BottomNavProps) => (
    <div className="min-h-[100vh] bg-background">
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold">BottomNav Playground</h1>
        <p className="text-sm text-gray-500">
          Controls에서 <code>pathname</code>을 바꿔서 활성 탭을 확인하세요.
        </p>
        <div className="h-[60vh] rounded-xl border border-dashed grid place-items-center">
          <span className="text-gray-500">콘텐츠 영역</span>
        </div>
      </div>
      <BottomNav {...args} />
    </div>
  ),
};

export const EachActive: Story = {
  name: '각 탭 활성 상태',
  render: () => (
    <div className="grid grid-cols-2 gap-6 min-h-[120vh] p-6 bg-background">
      {['/home', '/calendar', '/tours', '/mypage'].map((p) => (
        <div
          key={p}
          className="relative h-[50vh] rounded-xl border border-dashed"
        >
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-sm text-gray-500">pathname: {p}</span>
          </div>
          <BottomNav pathname={p} />
        </div>
      ))}
    </div>
  ),
};
