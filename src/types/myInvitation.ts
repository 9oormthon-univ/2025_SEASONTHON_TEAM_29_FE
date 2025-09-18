import type { ApiResponse } from '@/types/invitationGet';

export type MyInvitationSource = 'own' | 'couple' | string;

export interface MyInvitationData {
  hasInvitation: boolean;
  mainMediaUrl: string | null;
  source: MyInvitationSource | null;
  invitationId: number | null;
}

export type MyInvitationResponse = ApiResponse<MyInvitationData>;
