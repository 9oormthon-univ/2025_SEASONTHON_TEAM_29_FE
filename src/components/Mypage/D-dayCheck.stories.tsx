import type { Meta, StoryObj } from '@storybook/react';
import DdayCard from './D-dayCheck';

const meta: Meta<typeof DdayCard> = {
  title: 'mypage/DdayCard',
  component: DdayCard,
  tags: ['autodocs'],
  argTypes: {
    target: { control: 'date' },
    label: { control: 'text' },
  },
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof DdayCard>;

export const Default: Story = {
  args: {
    target: new Date('2026-05-10'),
    label: 'Wedding Day',
  },
};

export const CustomLabel: Story = {
  args: {
    target: new Date('2026-12-25'),
    label: 'Christmas Eve',
  },
};

export const WithoutIcons: Story = {
  args: {
    target: new Date('2026-05-10'),
    label: 'Wedding Day',
  },
};
