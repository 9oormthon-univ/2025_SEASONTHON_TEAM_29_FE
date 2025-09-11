import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DateSection, { DateSectionValue } from './DateSection';

const meta: Meta<typeof DateSection> = {
  title: 'section/DateSection',
  component: DateSection,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    title: { control: 'text' },
    defaultOpen: { control: 'boolean' },
    minuteStep: {
      control: { type: 'radio' },
      options: [5, 10, 15],
    },
    className: { control: false },
    onChange: { control: false },
    value: { control: 'object' },
  },
};
export default meta;

type Story = StoryObj<typeof DateSection>;

const DEFAULT_VALUE: DateSectionValue = {
  date: '2025-09-10',
  hour: 12,
  minute: 30,
  showCountdown: true,
};

function Stateful(args: any) {
  const [value, setValue] = useState<DateSectionValue>(
    args.value ?? DEFAULT_VALUE,
  );
  return <DateSection {...args} value={value} onChange={setValue} />;
}

export const Default: Story = {
  args: {
    title: '예약 일시',
    defaultOpen: true,
    value: DEFAULT_VALUE,
    minuteStep: 10,
  },
  render: (args) => <Stateful {...args} />,
};

export const Closed: Story = {
  args: {
    title: '예약 일시',
    defaultOpen: false,
    value: DEFAULT_VALUE,
    minuteStep: 10,
  },
  render: (args) => <Stateful {...args} />,
};

export const CountdownOff: Story = {
  args: {
    title: '예약 일시',
    defaultOpen: true,
    value: { ...DEFAULT_VALUE, showCountdown: false },
    minuteStep: 10,
  },
  render: (args) => <Stateful {...args} />,
};

export const Step5Minutes: Story = {
  args: {
    title: '예약 일시',
    defaultOpen: true,
    value: { ...DEFAULT_VALUE, minute: 25 },
    minuteStep: 5,
  },
  render: (args) => <Stateful {...args} />,
};
