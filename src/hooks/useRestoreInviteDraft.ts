'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  draftFieldKey,
  galleryKey,
  type ThemeDraft,
  type BasicInformationDraft,
  type GreetingsDraft,
  type MarriageDateDraft,
  type MarriagePlaceDraft,
  type GalleryMetaDraft,
} from '@/lib/buildInvitationPayload';
import type { InviteForm } from '@/types/invite';
import type { ComponentProps } from 'react';
import PlaceSection from '@/components/invitation/section/PlaceSection';
import GallerySection from '@/components/invitation/section/GallerySection';
import { applyLocalDraftIfNewer } from '@/hooks/useLocalDraft';

type PlaceSectionValue = ComponentProps<typeof PlaceSection>['value'];
type GallerySectionValue = ComponentProps<typeof GallerySection>['value'];

type Args = {
  draftId: number;
  setForm: React.Dispatch<React.SetStateAction<InviteForm>>;
  setPlaceLocal: React.Dispatch<React.SetStateAction<PlaceSectionValue>>;
  setGalleryLocal: React.Dispatch<React.SetStateAction<GallerySectionValue>>;
  onDone?: () => void;
  onHydrated?: () => void;
};

const tpl = (t?: string) =>
  (({ FILM: 'Film', LETTER: 'Letter', ALBUM: 'Album' }) as const)[
    String(t || '').toUpperCase()
  ] ?? 'Film';

const toHM = (time?: string) => {
  const [hh, mm] = String(time || '')
    .split(':')
    .map((v) => parseInt(v, 10));
  return {
    hour: Number.isFinite(hh) ? hh : 0,
    minute: Number.isFinite(mm) ? mm : 0,
  };
};

export function useRestoreInviteDraft({
  draftId,
  setForm,
  setPlaceLocal,
  setGalleryLocal,
  onDone,
  onHydrated,
}: Args) {
  const qc = useQueryClient();
  const restoredRef = useRef<number | null>(null);

  useEffect(() => {
    if (!draftId) return;
    if (restoredRef.current === draftId) return;
    restoredRef.current = draftId;

    const theme = qc.getQueryData<ThemeDraft>(draftFieldKey(draftId, 'theme'));
    const basic = qc.getQueryData<BasicInformationDraft>(
      draftFieldKey(draftId, 'basicInformation'),
    );
    const greet = qc.getQueryData<GreetingsDraft>(
      draftFieldKey(draftId, 'greetings'),
    );
    const md = qc.getQueryData<MarriageDateDraft>(
      draftFieldKey(draftId, 'marriageDate'),
    );
    const mp = qc.getQueryData<MarriagePlaceDraft>(
      draftFieldKey(draftId, 'marriagePlace'),
    );
    const gm = qc.getQueryData<GalleryMetaDraft>(
      draftFieldKey(draftId, 'gallery'),
    );
    const media =
      qc.getQueryData<{ mediaKey: string; sortOrder: number }[]>(
        galleryKey(draftId),
      ) ?? [];

    const nextPatch: Partial<InviteForm> = {};

    if (theme) {
      const themePatch = {
        fontFamily: theme.font,
        fontWeight: theme.fontSize,
        accent: theme.accentColor,
        template: tpl(theme.template),
        preventZoom: !theme.canEnlarge,
        revealOnScroll: !!theme.appearanceEffect,
      } as unknown as InviteForm['theme'];
      nextPatch.theme = themePatch;
    }

    if (basic) {
      const groomPatch = {
        firstName: basic.groomFirstName,
        lastName: basic.groomLastName,
        fatherName: basic.groomFatherName,
        motherName: basic.groomMotherName,
        fatherDeceased: basic.groomFatherDead,
        motherDeceased: basic.groomMotherDead,
      } as unknown as InviteForm['groom'];

      const bridePatch = {
        firstName: basic.brideFirstName,
        lastName: basic.brideLastName,
        fatherName: basic.brideFatherName,
        motherName: basic.brideMotherName,
        fatherDeceased: basic.brideFatherDead,
        motherDeceased: basic.brideMotherDead,
      } as unknown as InviteForm['bride'];

      nextPatch.groom = groomPatch;
      nextPatch.bride = bridePatch;
      nextPatch.order = (
        basic.brideFirst ? 'BRIDE_FIRST' : 'GROOM_FIRST'
      ) as InviteForm['order'];
    }

    if (greet) {
      const greetingPatch = {
        title: greet.greetingsTitle,
        body: greet.greetingsContent,
        ordered: !!greet.greetingsSortInOrder,
      } as unknown as InviteForm['greeting'];
      nextPatch.greeting = greetingPatch;
    }

    if (md) {
      const { hour, minute } = toHM(md.marriageTime);
      const ceremonyPatch = {
        date: md.marriageDate,
        hour,
        minute,
        showCountdown: !!md.representDDay,
      } as unknown as InviteForm['ceremony'];
      nextPatch.ceremony = ceremonyPatch;
    }

    if (media.length) {
      const photos = [...media]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((m) => m.mediaKey);
      nextPatch.gallery = photos as unknown as InviteForm['gallery'];
    }

    setForm((prev) => ({ ...prev, ...nextPatch }));

    if (mp) {
      setPlaceLocal({
        venueName: mp.vendorName,
        hallInfo: mp.floorAndHall,
        showMap: mp.drawSketchMap,
      });
    }
    if (gm || media.length) {
      const photos = media
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((m) => m.mediaKey);
      setGalleryLocal((prev) => ({
        layout: gm?.arrangement === 'SWIPE' ? 'SWIPE' : 'GRID',
        enablePopup: gm?.popUpViewer ?? prev.enablePopup,
        photos,
      }));
    }
    applyLocalDraftIfNewer({
      draftId,
      setForm,
      setPlaceLocal,
      setGalleryLocal,
    });

    onHydrated?.();
    onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);
}
