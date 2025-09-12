import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import BasicInfoSection, {
  type BasicInfoValue,
} from './section/BasicInfoSection';

const DEFAULT_VALUE: BasicInfoValue = {
  groom: {
    lastName: '',
    firstName: '',
    fatherName: '',
    fatherDeceased: false,
    motherName: '',
    motherDeceased: false,
  },
  bride: {
    lastName: '',
    firstName: '',
    fatherName: '',
    fatherDeceased: false,
    motherName: '',
    motherDeceased: false,
  },
  order: 'GROOM_FIRST',
};

function StatefulWrapper(
  props: Omit<
    React.ComponentProps<typeof BasicInfoSection>,
    'value' | 'onChange'
  > & {
    initial?: BasicInfoValue;
  },
) {
  const [val, setVal] = useState<BasicInfoValue>(
    props.initial ?? DEFAULT_VALUE,
  );
  return (
    <div className="p-6 bg-background text-foreground">
      <BasicInfoSection
        {...props}
        value={val}
        onChange={(next) => setVal(next)}
      />
      <pre className="mt-4 text-xs text-text--secondary">
        {JSON.stringify(val, null, 2)}
      </pre>
    </div>
  );
}

const meta: Meta<typeof BasicInfoSection> = {
  title: 'section/BasicInfoSection',
  component: BasicInfoSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '기본정보 섹션 아코디언. 신랑/신부 기본 정보와 부모 성함 및 故 여부, 항목 순서를 설정합니다. 헤더 아이콘은 `/public/icons/down.svg`, 체크는 `/public/icons/check.svg`을 사용합니다.',
      },
    },
  },
  argTypes: {
    className: { control: 'text' },
    title: { control: 'text' },
    defaultOpen: { control: 'boolean' },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  render: (args) => <StatefulWrapper {...args} initial={DEFAULT_VALUE} />,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  name: '접힘 (Default)',
  args: { title: '기본정보', defaultOpen: false },
};

export const Expanded: Story = {
  name: '펼침',
  args: { title: '기본정보', defaultOpen: true },
};
