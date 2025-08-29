import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Check, { CheckType } from './check';

const meta: Meta<typeof Check> = {
  title: 'common/Check',
  component: Check,
  parameters: { layout: 'centered' },
  argTypes: {
    type: {
      options: ['default', 'variant2', 'selectedFull', 'selectedLine'] satisfies CheckType[],
      control: { type: 'radio' },
    },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Check>;

export const Playground: Story = {
  args: { type: 'default' },
};

export const Variants: Story = {
  name: 'All Variants',
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <Check type="default" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <Check type="variant2" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <Check type="selectedFull" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <Check type="selectedLine" />
      </div>
    </div>
  ),
};

export const ToggleExample: Story = {
  name: 'Toggle (click to cycle)',
  render: (args) => {
    const order: CheckType[] = ['default', 'variant2', 'selectedFull', 'selectedLine'];
    const [idx, setIdx] = React.useState(0);
    const type = order[idx];

    return (
      <div className="flex flex-col items-center gap-2">
        <Check
          {...args}
          type={type}
          onClick={() => setIdx((i) => (i + 1) % order.length)}
          ariaLabel="Toggle check example"
        />
        <span className="text-xs text-gray-500">{type}</span>
      </div>
    );
  },
};
