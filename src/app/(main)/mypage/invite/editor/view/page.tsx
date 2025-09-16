import InvitationPreview from '@/components/invitation/view/InvitationPreview';
import { INVITATION_MOCK } from '@/types/invitation';

export default function Page() {
  return (
    <div className="min-h-svh w-full overflow-x-hidden overflow-y-auto bg-[#090909]">
      <InvitationPreview payload={INVITATION_MOCK.data} />
    </div>
  );
}
