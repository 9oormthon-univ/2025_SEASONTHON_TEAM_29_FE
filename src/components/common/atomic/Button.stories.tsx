import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'common/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: {
    children: '텍스트',
    size: 'lg',
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['lg', 'md'],
    },
    state: {
      control: { type: 'radio' },
      options: ['default', 'hover', 'inactive', undefined],
      description:
        '미지정(undefined) 시 실제 :hover 효과 사용. disabled=true면 inactive와 동일',
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  args: { state: undefined, disabled: false, fullWidth: false },
};

export const LG_States: Story = {
  name: 'LG ',
  render: () => (
    <div className="flex flex-col gap-4 w-[340px]">
      <Button size="lg" state="default">
        텍스트
      </Button>
      <Button size="lg" state="hover">
        텍스트
      </Button>
      <Button size="lg" state="inactive">
        텍스트
      </Button>
    </div>
  ),
};

export const MD_States: Story = {
  name: 'MD ',
  render: () => (
    <div className="flex flex-col gap-4 w-[240px]">
      <Button size="md" state="default">
        텍스트
      </Button>
      <Button size="md" state="hover">
        텍스트
      </Button>
      <Button size="md" state="inactive">
        텍스트
      </Button>
    </div>
  ),
};

export const Matrix: Story = {
  name: 'Size별 정리',
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-3">
        <div className="text-sm text-gray-500">LG</div>
        <Button size="lg" state="default">
          default
        </Button>
        <Button size="lg" state="hover">
          hover
        </Button>
        <Button size="lg" state="inactive">
          inactive
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-sm text-gray-500">MD</div>
        <Button size="md" state="default">
          default
        </Button>
        <Button size="md" state="hover">
          hover
        </Button>
        <Button size="md" state="inactive">
          inactive
        </Button>
      </div>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-[360px]">
      <Button size="lg" fullWidth>
        풀폭 버튼
      </Button>
    </div>
  ),
};
