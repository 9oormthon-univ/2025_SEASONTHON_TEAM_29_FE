import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import TextField, { type TextFieldProps } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'common/TextField',
  component: TextField,
  parameters: { layout: 'padded' },
  args: {
    placeholder: '기억하고 싶은 내용을 적어주세요.',
    maxLength: 500,
    showCount: true,
    className: 'w-80 h-52',
  },
  argTypes: {
    onChange: { action: 'change' },
    className: { control: 'text' },
    textareaClassName: { control: 'text' },
    maxLength: { control: { type: 'number', min: 1, step: 1 } },
    showCount: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof TextField>;

export const Playground: Story = {};

export const Filled: Story = {
  name: '채운 상태 보기',
  render: () => (
    <TextField
      defaultValue={`뷔페 음식 종류 파악
생화장식으로 할 시에 가격 형성은?
홀 내부 조명 위치 사진찍기`}
    />
  ),
};

export const Controlled: Story = {
  render: (args: TextFieldProps) => {
    const [v, setV] = React.useState('');
    return (
      <div className="space-y-2">
        <TextField {...args} value={v} onChange={setV} />
        <div className="text-xs text-gray-500">length: {v.length}</div>
      </div>
    );
  },
};

export const CustomSize: Story = {
  render: () => <TextField className="w-[480px] h-60" />,
};

export const NoCounter: Story = {
  render: () => <TextField showCount={false} />,
};
