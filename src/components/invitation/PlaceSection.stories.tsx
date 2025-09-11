import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import PlaceSection, { PlaceSectionValue } from './PlaceSection';

const meta: Meta<typeof PlaceSection> = {
  title: 'section/PlaceSection',
  component: PlaceSection,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    title: { control: 'text' },
    defaultOpen: { control: 'boolean' },
    value: { control: 'object' },
    className: { control: false },
    onChange: { control: false },
    onSearch: { action: 'search', table: { category: 'events' } },
  },
};
export default meta;

type Story = StoryObj<typeof PlaceSection>;

const DEFAULT_VALUE: PlaceSectionValue = {
  venueName: '',
  hallInfo: '',
  showMap: true,
};

function Stateful(args: any) {
  const [value, setValue] = useState<PlaceSectionValue>(
    args.value ?? DEFAULT_VALUE,
  );
  return <PlaceSection {...args} value={value} onChange={setValue} />;
}

export const Default: Story = {
  args: {
    title: '예약 장소',
    defaultOpen: true,
    value: DEFAULT_VALUE,
  },
  render: (args) => <Stateful {...args} />,
};

export const Closed: Story = {
  args: {
    title: '예약 장소',
    defaultOpen: false,
    value: DEFAULT_VALUE,
  },
  render: (args) => <Stateful {...args} />,
};

export const MapOff: Story = {
  args: {
    title: '예약 장소',
    defaultOpen: true,
    value: { ...DEFAULT_VALUE, showMap: false },
  },
  render: (args) => <Stateful {...args} />,
};
