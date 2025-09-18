'use client';

import { useQuery } from '@tanstack/react-query';
import { getInvitation } from '@/services/invitation.api';
import type { InvitationResponse, InvitationData } from '@/types/invitationGet';

const QUERY_KEY = ['invitation'] as const;

export function useInvitationQuery() {
  return useQuery<InvitationResponse, Error, InvitationData>({
    queryKey: QUERY_KEY,
    queryFn: ({ signal }) => getInvitation({ signal }),
    select: (res) => res.data,
    staleTime: 60_000,
  });
}
