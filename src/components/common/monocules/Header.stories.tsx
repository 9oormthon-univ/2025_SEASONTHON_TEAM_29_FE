import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Header, { type HeaderProps } from './Header';

const meta: Meta<typeof Header> = {
  title: 'common/Header',
  component: Header,
  parameters: { layout: 'padded' },
  args: {
    value: '회원가입',
    showBack: true,
  },
  argTypes: {
    value: { control: 'text' },
    showBack: { control: 'boolean' },
    className: { control: 'text' },
    onBack: { action: 'back' },
  },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Playground: Story = {};

export const NoBackButton: Story = {
  args: { showBack: false, value: '타이틀' },
};

export const CustomHeight: Story = {
  name: 'Custom height (h-14)',
  args: { className: 'h-14', value: '회원가입' },
};

export const WithCustomBack: Story = {
  render: (args: HeaderProps) => (
    <Header
      {...args}
      onBack={() => {
        console.log('뒤로가기 클릭!');
      }}
    />
  ),
  args: { value: '회원가입' },
};
