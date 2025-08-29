import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Label from './Label';

const meta: Meta<typeof Label> = {
  title: 'common/Label',
  component: Label,
  parameters: { layout: 'padded' },
  args: {
    children: '이름',
    size: 'sm',
    variant: 'default',
  },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'lg'] },
    variant: { control: 'radio', options: ['default', 'variant3'] },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Playground: Story = {};

export const AllStates: Story = {
  name: 'Sizes × Variants',
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-8">
        <Label size="sm">sm / default</Label>
        <Label size="sm" variant="variant3">
          sm / variant3
        </Label>
      </div>
      <div className="flex items-center gap-8">
        <Label size="lg">lg / default</Label>
        <Label size="lg" variant="variant3">
          lg / variant3
        </Label>
      </div>
    </div>
  ),
};

export const LongText: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Label size="sm">아주아주 긴 텍스트 테스트 입니다</Label>
      <Label size="lg" variant="variant3">
        아주아주 긴 텍스트 테스트 입니다
      </Label>
    </div>
  ),
};
