import { useMutation } from '@tanstack/react-query';
import { createInvitation } from '@/services/invitation.api';
import type { InvitationRequestBody } from '@/types/invitation';

export function useCreateInvitation() {
  return useMutation<{ id: number }, Error, InvitationRequestBody>({
    mutationFn: async (payload) => {
      const res = await createInvitation(payload);
      return res.data;
    },
  });
}
