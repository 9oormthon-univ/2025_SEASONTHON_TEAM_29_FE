import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import CalendarDay from './CalendarDay';

const meta: Meta<typeof CalendarDay> = {
  title: 'calendar/CalendarDay',
  component: CalendarDay,
  parameters: { layout: 'padded' },
  args: {
    day: 1,
    weekday: '월',
    type: 'dd',
  },
  argTypes: {
    type: { control: 'radio', options: ['dd', 'variant2', 'hover'] },
    day: { control: { type: 'number', min: 1, max: 31, step: 1 } },
    weekday: { control: 'text' },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof CalendarDay>;

export const Playground: Story = {};

export const Types: Story = {
  name: '각 컴포넌트(타입) 보기',
  render: () => (
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">dd</span>
        <CalendarDay type="dd" day={1} weekday="월" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">variant2</span>
        <CalendarDay type="variant2" day={1} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">hover</span>
        <CalendarDay type="hover" day={1} />
      </div>
    </div>
  ),
};

export const Week: Story = {
  render: () => {
    const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
    return (
      <div className="flex gap-3">
        {weekdays.map((w, i) => (
          <CalendarDay key={w} type="dd" day={i + 1} weekday={w} />
        ))}
      </div>
    );
  },
};

export const Month: Story = {
  args: {
    // @ts-ignore
    year: new Date().getFullYear(),
    // @ts-ignore
    month: new Date().getMonth() + 1,
    startOn: 'mon' as 'sun' | 'mon',
  },
  argTypes: {
    // @ts-ignore
    year: { control: { type: 'number', min: 1970, max: 2100, step: 1 } },
    // @ts-ignore
    month: { control: { type: 'number', min: 1, max: 12, step: 1 } },
    // @ts-ignore
    startOn: { control: 'radio', options: ['sun', 'mon'] },
  },
  // @ts-ignore
  render: ({ year, month, startOn }) => {
    const y = Number(year);
    const m = Number(month);
    const daysInMonth = new Date(y, m, 0).getDate();
    const firstWeekdaySun0 = new Date(y, m - 1, 1).getDay();
    const offset =
      startOn === 'sun' ? firstWeekdaySun0 : (firstWeekdaySun0 + 6) % 7;

    const cells: Array<{ day?: number }> = [
      ...Array.from({ length: offset }).map(() => ({ day: undefined })),
      ...Array.from({ length: daysInMonth }).map((_, i) => ({ day: i + 1 })),
    ];
    const tail = (7 - (cells.length % 7)) % 7;
    for (let i = 0; i < tail; i++) cells.push({ day: undefined });

    return (
      <div className="inline-grid grid-cols-7 gap-3">
        {cells.map((c, idx) =>
          c.day ? (
            <CalendarDay key={idx} type="variant2" day={c.day} />
          ) : (
            <div key={idx} className="w-10 h-16" />
          ),
        )}
      </div>
    );
  },
};
