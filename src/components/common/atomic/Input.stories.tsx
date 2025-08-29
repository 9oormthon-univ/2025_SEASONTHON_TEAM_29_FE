import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Input, { type InputProps } from './Input';

const meta: Meta<typeof Input> = {
  title: 'common/Input',
  component: Input,
  parameters: {
    layout: 'padded',
  },
  args: {
    placeholder: '내용을 입력해 주세요.',
    type: 'default',
    inputType: 'text',
    fullWidth: true,
    disabled: false,
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['default', 'hover', 'variant4', 'variant5', 'incorrect'],
    },
    inputType: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
    },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Playground: Story = {
  render: (args: InputProps) => (
    <div className="max-w-[420px]">
      <Input {...args} />
    </div>
  ),
};

export const AllStates: Story = {
  name: 'All UI Types',
  render: () => (
    <div className="max-w-[420px] space-y-4">
      <Input type="default" placeholder="default" />
      <Input type="hover" placeholder="hover" />
      <Input type="variant4" placeholder="variant4" />
      <Input type="incorrect" defaultValue="incorrect" />
      <Input type="variant5" placeholder="variant5 (caret + bar)" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-[420px] space-y-4">
      <Input disabled placeholder="비활성 (default)" />
      <Input type="variant4" disabled placeholder="비활성 (variant4)" />
    </div>
  ),
};

export const FixedWidth: Story = {
  name: 'Fixed width (w-80)',
  render: () => (
    <div className="space-y-4">
      <Input fullWidth={false} placeholder="w-80" />
      <Input type="variant5" fullWidth={false} placeholder="w-80 / variant5" />
    </div>
  ),
};
