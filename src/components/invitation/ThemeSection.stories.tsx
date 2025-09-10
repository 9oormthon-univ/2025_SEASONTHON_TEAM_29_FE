import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ThemaSection, { type ThemaSectionValue } from './ThemeSection';

const DEFAULT_VALUE: ThemaSectionValue = {
  fontFamily: '나눔명조',
  fontWeight: '보통',
  accent: '#F7C7C7',
  template: 'Film',
  preventZoom: true,
  revealOnScroll: true,
};

function StatefulWrapper(props: React.ComponentProps<typeof ThemaSection>) {
  const [val, setVal] = useState<ThemaSectionValue>(
    props.value ?? DEFAULT_VALUE,
  );
  return (
    <div className="p-6 bg-background text-foreground">
      <ThemaSection
        {...props}
        value={val}
        onChange={(next) => {
          setVal(next);
          props.onChange?.(next);
        }}
      />
      <pre className="mt-4 text-xs text-text--secondary">
        {JSON.stringify(val, null, 2)}
      </pre>
    </div>
  );
}

const meta: Meta<typeof ThemaSection> = {
  title: 'section/ThemaSection',
  component: ThemaSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '테마 섹션 아코디언. 글꼴/강조색/템플릿/토글을 설정합니다. 헤더의 아이콘은 `/public/icons/down.svg`(SvgObject) 사용.',
      },
    },
  },
  argTypes: {
    className: { control: 'text' },
    title: { control: 'text' },
    defaultOpen: { control: 'boolean' },
    accents: {
      control: 'object',
      description: '강조 색상 팔레트',
    },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  render: (args) => (
    <StatefulWrapper {...args} value={DEFAULT_VALUE} onChange={() => {}} />
  ),
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  name: '접힘 (Default)',
  args: {
    title: '테마',
    defaultOpen: false,
    accents: ['#F7C7C7', '#C8B7F0', '#FBEFCF'],
  },
};

export const Expanded: Story = {
  name: '펼침',
  args: {
    title: '테마',
    defaultOpen: true,
  },
};

export const LongContainer: Story = {
  name: '레이아웃 예시(좌측정렬)',
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="w-[420px]">
      <StatefulWrapper {...args} value={DEFAULT_VALUE} onChange={() => {}} />
    </div>
  ),
};
