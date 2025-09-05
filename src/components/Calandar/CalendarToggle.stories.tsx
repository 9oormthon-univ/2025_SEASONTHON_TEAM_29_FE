import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import CalendarToggle, { type CalendarToggleProps } from './CalendarToggle';

const meta: Meta<typeof CalendarToggle> = {
  title: 'Calendar/CalendarToggle',
  component: CalendarToggle,
  parameters: { layout: 'padded' },
  args: {
    labels: { event: '행사', schedule: '일정' },
  },
  argTypes: {
    className: { control: 'text' },
    labels: { control: 'object' },
  },
};
export default meta;

type Story = StoryObj<typeof CalendarToggle>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: (args: CalendarToggleProps) => {
    const [v, setV] = React.useState<'event' | 'schedule'>('event');
    return (
      <div className="flex items-center gap-4">
        <CalendarToggle {...args} value={v} onChange={setV} />
        <span className="text-sm text-gray-500">value: {v}</span>
      </div>
    );
  },
};
