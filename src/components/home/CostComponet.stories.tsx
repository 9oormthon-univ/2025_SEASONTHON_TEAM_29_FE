import type { Meta, StoryObj } from '@storybook/nextjs';
import PriceTrend from './CostComponent';

const meta: Meta<typeof PriceTrend> = {
  title: 'Charts/PriceTrend',
  component: PriceTrend,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PriceTrend>;

export const Default: Story = {
  args: {},
};
