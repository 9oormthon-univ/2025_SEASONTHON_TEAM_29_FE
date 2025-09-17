'use client';

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { MediaItem } from '@/types/invitation';

export type StagedMedia = {
  mainMedia: MediaItem | null;
  filmMedia: MediaItem[];
  ticketMedia: MediaItem | null;
};

const initial: StagedMedia = {
  mainMedia: null,
  filmMedia: [],
  ticketMedia: null,
};
const key = (inviteId: number | string) =>
  ['invitation', 'media', String(inviteId)] as const;

export function useStagedInvitationMedia(inviteId: number | string) {
  const qc = useQueryClient();

  useQuery({
    queryKey: key(inviteId),
    queryFn: async () => initial,
    initialData: () => qc.getQueryData<StagedMedia>(key(inviteId)) ?? initial,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const stageMainMedia = useCallback(
    (item: MediaItem) => {
      qc.setQueryData<StagedMedia>(key(inviteId), (prev) => ({
        ...(prev ?? initial),
        mainMedia: item,
      }));
      return qc.getQueryData<StagedMedia>(key(inviteId)) ?? initial;
    },
    [inviteId, qc],
  );

  const stageFilmMedia = useCallback(
    (items: MediaItem[]) => {
      const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
      qc.setQueryData<StagedMedia>(key(inviteId), (prev) => ({
        ...(prev ?? initial),
        filmMedia: sorted,
      }));
      return qc.getQueryData<StagedMedia>(key(inviteId)) ?? initial;
    },
    [inviteId, qc],
  );

  const stageTicketMedia = useCallback(
    (item: MediaItem) => {
      qc.setQueryData<StagedMedia>(key(inviteId), (prev) => ({
        ...(prev ?? initial),
        ticketMedia: item,
      }));
      return qc.getQueryData<StagedMedia>(key(inviteId)) ?? initial;
    },
    [inviteId, qc],
  );

  const clear = useCallback(
    () => qc.setQueryData(key(inviteId), initial),
    [inviteId, qc],
  );

  const staged = qc.getQueryData<StagedMedia>(key(inviteId)) ?? initial;
  return { staged, stageMainMedia, stageFilmMedia, stageTicketMedia, clear };
}
