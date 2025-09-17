import type { QueryClient } from '@tanstack/react-query';
import type { InvitationRequestBody } from '@/types/invitation';
import type { InviteForm } from '@/types/invite';
import type { MediaItem } from '@/types/invitation';
import type { ComponentProps } from 'react';
import PlaceSection from '@/components/invitation/section/PlaceSection';
import GallerySection from '@/components/invitation/section/GallerySection';
import { toInvitationPayload } from '@/lib/invitationAdapter';
export const galleryKey = (draftId: number) =>
  ['invitation', 'mediaList', String(draftId)] as const;

export const draftFieldKey = (draftId: number, field: string) =>
  ['invitation', 'draft', String(draftId), field] as const;

export function clearDraftCache(qc: QueryClient, draftId: number) {
  qc.removeQueries({ queryKey: galleryKey(draftId), exact: true });
  qc.removeQueries({
    queryKey: ['invitation', 'draft', String(draftId)],
    exact: false,
  });
}

export type ThemeDraft = {
  font: string;
  fontSize: string;
  accentColor: string;
  template: 'FILM' | string;
  canEnlarge: boolean;
  appearanceEffect: boolean;
};

export type BasicInformationDraft = {
  groomFirstName: string;
  groomLastName: string;
  groomFatherName: string;
  groomMotherName: string;
  brideFirstName: string;
  brideLastName: string;
  brideFatherName: string;
  brideMotherName: string;
  groomFatherDead: boolean;
  groomMotherDead: boolean;
  brideFatherDead: boolean;
  brideMotherDead: boolean;
  brideFirst: boolean;
};

export type GreetingsDraft = {
  greetingsTitle: string;
  greetingsContent: string;
  greetingsSortInOrder: boolean;
};

export type MarriageDateDraft = {
  marriageDate: string;
  marriageTime: string;
  representDDay: boolean;
};

export type MarriagePlaceDraft = {
  vendorName: string;
  floorAndHall: string;
  drawSketchMap: boolean;
};

export type GalleryMetaDraft = {
  galleryTitle: string;
  arrangement: 'SWIPE' | 'GRID';
  popUpViewer: boolean;
};
export type PlaceSectionValue = ComponentProps<typeof PlaceSection>['value'];
export type GallerySectionValue = ComponentProps<
  typeof GallerySection
>['value'];

type StagedBundle = {
  mainMedia?: MediaItem | null;
  filmMedia?: MediaItem[] | null;
  ticketMedia?: MediaItem | null;
};

type BuildArgs = {
  form: InviteForm;
  placeLocal: PlaceSectionValue;
  galleryLocal: GallerySectionValue;
  staged: StagedBundle;
  draftId: number;
  qc: QueryClient;
};
export function buildInvitationPayload(args: BuildArgs): InvitationRequestBody {
  const { form, placeLocal, galleryLocal, staged, draftId, qc } = args;
  const base = toInvitationPayload(form, placeLocal, galleryLocal, {
    mainMedia: staged.mainMedia ?? undefined,
    filmMedia: staged.filmMedia ?? undefined,
    ticketMedia: staged.ticketMedia ?? undefined,
  }) as any;
  const theme = qc.getQueryData<ThemeDraft>(draftFieldKey(draftId, 'theme'));
  const basic = qc.getQueryData<BasicInformationDraft>(
    draftFieldKey(draftId, 'basicInformation'),
  );
  const greetings = qc.getQueryData<GreetingsDraft>(
    draftFieldKey(draftId, 'greetings'),
  );
  const marriageDate = qc.getQueryData<MarriageDateDraft>(
    draftFieldKey(draftId, 'marriageDate'),
  );
  const marriagePlace = qc.getQueryData<MarriagePlaceDraft>(
    draftFieldKey(draftId, 'marriagePlace'),
  );
  const galleryMeta = qc.getQueryData<GalleryMetaDraft>(
    draftFieldKey(draftId, 'gallery'),
  );

  if (theme) base.theme = theme;
  if (basic) base.basicInformation = basic;
  if (greetings) base.greetings = greetings;
  if (marriageDate) base.marriageDate = marriageDate;
  if (marriagePlace) base.marriagePlace = marriagePlace;
  if (galleryMeta) base.gallery = galleryMeta;
  const mediaList = qc.getQueryData<MediaItem[]>(galleryKey(draftId)) ?? [];
  if (mediaList.length > 0) {
    base.mediaList = [...mediaList].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  return base as InvitationRequestBody;
}
