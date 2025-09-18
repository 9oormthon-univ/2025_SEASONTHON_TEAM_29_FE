'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyInvitation } from '@/services/invitation.api';
import type {
  MyInvitationResponse,
  MyInvitationData,
} from '@/types/myInvitation';

const QUERY_KEY = ['my-invitation'] as const;

export function useMyInvitationQuery() {
  return useQuery<MyInvitationResponse, Error, MyInvitationData>({
    queryKey: QUERY_KEY,
    queryFn: ({ signal }) => getMyInvitation({ signal }),
    select: (res) => res.data,
    staleTime: 60_000,
  });
}
