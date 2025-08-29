import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import ProgressBar, { type ProgressBarProps } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'common/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  args: {
    value: 30,
    max: 100,
    size: 'sm',
    rounded: true,
    className: 'w-80',
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1 } },
    size: { control: 'radio', options: ['xs', 'sm', 'md', 'lg'] },
    rounded: { control: 'boolean' },
    className: { control: 'text' },
    trackClassName: { control: 'text' },
    indicatorClassName: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args: ProgressBarProps) => (
    <div className="space-y-4">
      <ProgressBar {...args} size="xs" value={25} />
      <ProgressBar {...args} size="sm" value={50} />
      <ProgressBar {...args} size="md" value={75} />
      <ProgressBar {...args} size="lg" value={90} />
    </div>
  ),
};

export const CustomStyle: Story = {
  name: 'Custom colors',
  render: (args: ProgressBarProps) => (
    <div className="space-y-4">
      <ProgressBar
        {...args}
        value={40}
        trackClassName="bg-zinc-300"
        indicatorClassName="bg-primary-500"
      />
      <ProgressBar
        {...args}
        value={80}
        trackClassName="bg-gray-200"
        indicatorClassName="bg-accent-500"
      />
    </div>
  ),
};

export const AutoPlay: Story = {
  render: (args: ProgressBarProps) => {
    const [v, setV] = React.useState(0);
    React.useEffect(() => {
      const id = setInterval(
        () => setV((x) => (x >= (args.max ?? 100) ? 0 : x + 5)),
        500,
      );
      return () => clearInterval(id);
    }, [args.max]);
    return (
      <div className="space-y-2">
        <ProgressBar {...args} value={v} />
        <div className="text-sm text-gray-500">value: {v}</div>
      </div>
    );
  },
};
