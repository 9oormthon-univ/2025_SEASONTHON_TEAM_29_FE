import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import SearchBar from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'common/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[390px] bg-background py-4">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Playground: Story = {
  render: () => <SearchBar />,
};

export const Wide: Story = {
  name: 'Wide (720px)',
  render: () => (
    <div className="mx-auto w-[720px]">
      <SearchBar />
    </div>
  ),
};
