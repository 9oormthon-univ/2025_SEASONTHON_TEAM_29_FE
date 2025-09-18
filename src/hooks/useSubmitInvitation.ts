'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type { InvitationResponse, MediaItem } from '@/types/invitation';
import type { InviteForm } from '@/types/invite';
import type { ComponentProps } from 'react';
import PlaceSection from '@/components/invitation/section/PlaceSection';
import GallerySection from '@/components/invitation/section/GallerySection';
import {
  buildInvitationPayload,
  clearDraftCache,
} from '@/lib/buildInvitationPayload';
import { useCreateInvitation } from '@/hooks/useCreateInvitation';

type PlaceSectionValue = ComponentProps<typeof PlaceSection>['value'];
type GallerySectionValue = ComponentProps<typeof GallerySection>['value'];

type StagedBundle = {
  mainMedia?: MediaItem | null;
  filmMedia?: MediaItem[] | null;
  ticketMedia?: MediaItem | null;
};

type Args = {
  form: InviteForm;
  placeLocal: PlaceSectionValue;
  galleryLocal: GallerySectionValue;
  staged: StagedBundle;
  draftId: number;
  onSuccessRoute?: string;
  clearStaged?: () => void;
  onSuccess?: (res: InvitationResponse) => void;
  onError?: (err: Error) => void;
};

export function useSubmitInvitation({
  form,
  placeLocal,
  galleryLocal,
  staged,
  draftId,
  onSuccessRoute = '/mypage/invite/view',
  clearStaged,
  onSuccess,
  onError,
}: Args) {
  const router = useRouter();
  const qc = useQueryClient();
  const { mutateAsync, isPending } = useCreateInvitation();
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      const payload = buildInvitationPayload({
        form,
        placeLocal,
        galleryLocal,
        staged,
        draftId,
        qc,
      });
      const res = await mutateAsync(payload);
      clearStaged?.();
      clearDraftCache(qc, draftId);
      onSuccess?.(res);
      if (onSuccessRoute) router.replace(onSuccessRoute);
      return res;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      onError?.(err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    submit,
    isSubmitting: saving || isPending,
  };
}
