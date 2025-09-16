import type { Meta, StoryObj } from '@storybook/react';
import InvitationMessage, {
  INVITATION_MESSAGE_MOCK,
} from './InvitationMessage';

const meta: Meta<typeof InvitationMessage> = {
  title: 'Invitation/InvitationMessage',
  component: InvitationMessage,
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof InvitationMessage>;

export const Default: Story = {
  render: () => (
    <InvitationMessage
      title={INVITATION_MESSAGE_MOCK.title}
      message={INVITATION_MESSAGE_MOCK.message}
      align="center"
    />
  ),
};
