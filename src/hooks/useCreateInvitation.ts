'use client';

import { useMutation } from '@tanstack/react-query';
import { createInvitation } from '@/services/invitation.api';
import type {
  InvitationRequestBody,
  InvitationResponse,
} from '@/types/invitation';

export function useCreateInvitation() {
  return useMutation<InvitationResponse, Error, InvitationRequestBody>({
    mutationFn: (payload) => createInvitation(payload),
  });
}
