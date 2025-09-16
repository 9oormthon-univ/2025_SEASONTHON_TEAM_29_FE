import type { Meta, StoryObj } from '@storybook/react';
import TicketImage from './TicketImage';

const meta: Meta<typeof TicketImage> = {
  title: 'Invitation/TicketImage',
  component: TicketImage,
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  args: {
    dayText: 'SAT',
    dateText: '2026.05.16',
    timeText: 'P.M. 1:30',
    placeLine1: '서울 강남구 테헤란로 322',
    placeLine2: '아펠가모 선릉홀 4층',
  },
  argTypes: {
    imageUrl: { control: 'text' },
    dayText: { control: 'text' },
    dateText: { control: 'text' },
    timeText: { control: 'text' },
    placeLine1: { control: 'text' },
    placeLine2: { control: 'text' },
    defaultMode: {
      control: { type: 'radio' },
      options: ['color', 'photo'],
    },
    disableToggle: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof TicketImage>;

export const ColorOnly: Story = {
  name: 'Color only',
  args: {
    imageUrl: null,
  },
};

export const Photo: Story = {
  name: 'Photo (with toggle)',
  args: {
    imageUrl: '/mock/main-sample.jpg',

    defaultMode: 'photo',
  },
};

export const StartOnColor: Story = {
  name: 'Photo available → start on Color',
  args: {
    imageUrl: '/mock/main-sample.jpg',
    defaultMode: 'color',
  },
};

export const LongTexts: Story = {
  name: 'Long texts',
  args: {
    imageUrl: '/mock/main-sample.jpg',
    placeLine1: '서울특별시 강남구 테헤란로 322, 아펠가모 선릉홀',
    placeLine2: '지하철 2호선 선릉역 5번 출구 도보 3분',
  },
};
