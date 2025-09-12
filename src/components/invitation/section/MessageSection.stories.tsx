import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import MessageSection, { MessageSectionValue } from './MessageSection';

const meta: Meta<typeof MessageSection> = {
  title: 'section/MessageSection',
  component: MessageSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: { control: 'text' },
    defaultOpen: { control: 'boolean' },
    className: { control: false },
    onChange: { control: false },
    value: { control: 'object' },
  },
};
export default meta;

type Story = StoryObj<typeof MessageSection>;

const DEFAULT_VALUE: MessageSectionValue = {
  title: '소중한 분들을 초대합니다.',
  body:
    '시간을 돌릴 수 있다면, 우리는 언제나 다시 서로를 선택할 것입니다. ' +
    '함께하는 오늘이 늘 가장 특별한 날이 되도록, 이제 부부로서 평생의 시간을 함께하고자 합니다. ' +
    '저희 두 사람의 첫걸음을 축복해 주시면 큰 기쁨이 되겠습니다.',
  ordered: true,
};

function Stateful(args: any) {
  const [value, setValue] = useState<MessageSectionValue>(
    args.value ?? DEFAULT_VALUE,
  );
  return <MessageSection {...args} value={value} onChange={setValue} />;
}

export const Default: Story = {
  args: {
    title: '인사말',
    defaultOpen: true,
    value: DEFAULT_VALUE,
  },
  render: (args) => <Stateful {...args} />,
};

export const Empty: Story = {
  args: {
    title: '인사말',
    defaultOpen: true,
    value: { title: '', body: '', ordered: false },
  },
  render: (args) => <Stateful {...args} />,
};
