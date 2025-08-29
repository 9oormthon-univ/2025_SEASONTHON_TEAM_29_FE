import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import InputBadge from './InputBadge';

const meta: Meta<typeof InputBadge> = {
  title: 'common/InputBadge',
  component: InputBadge,
  parameters: { layout: 'padded' },
  args: { children: '인증번호', variant: 'primary', as: 'div' },
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary', 'ghost'] },
    as: { control: 'radio', options: ['div', 'span'] },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof InputBadge>;

export const Playground: Story = {};

export const All: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <InputBadge {...args} variant="primary">
        인증번호
      </InputBadge>
      <InputBadge {...args} variant="secondary">
        인증번호
      </InputBadge>
      <InputBadge {...args} variant="ghost">
        인증번호
      </InputBadge>
    </div>
  ),
};
