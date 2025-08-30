import type { Meta, StoryObj } from '@storybook/nextjs';
import Chips from './Chips';

const meta: Meta<typeof Chips> = {
  title: 'common/Chips',
  component: Chips,
  parameters: { layout: 'padded' },
  args: {
    children: '칩',
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

type Story = StoryObj<typeof Chips>;

export const Playground: Story = {};

export const AllStates: Story = {
  name: 'Sizes × Variants',
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-8">
        <Chips size="sm">sm / default</Chips>
        <Chips size="sm" variant="variant3">
          sm / variant3
        </Chips>
      </div>
      <div className="flex items-center gap-8">
        <Chips size="lg">lg / default</Chips>
        <Chips size="lg" variant="variant3">
          lg / variant3
        </Chips>
      </div>
    </div>
  ),
};

export const LongText: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Chips size="sm">아주아주 긴 텍스트 테스트 입니다</Chips>
      <Chips size="lg" variant="variant3">
        아주아주 긴 텍스트 테스트 입니다
      </Chips>
    </div>
  ),
};