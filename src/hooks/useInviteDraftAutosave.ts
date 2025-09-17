'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { InviteForm } from '@/types/invite';
import type { ComponentProps } from 'react';
import PlaceSection from '@/components/invitation/section/PlaceSection';
import GallerySection from '@/components/invitation/section/GallerySection';
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

type PlaceSectionValue = ComponentProps<typeof PlaceSection>['value'];
type GallerySectionValue = ComponentProps<typeof GallerySection>['value'];

const str = (v: unknown, d = ''): string =>
  v == null ? d : typeof v === 'string' ? v : String(v);

const bool = (v: unknown, d = false): boolean =>
  v == null ? d : typeof v === 'boolean' ? v : !!v;

const num = (v: unknown, d = 0): number =>
  v == null ? d : typeof v === 'number' ? v : Number(v);

type Options = { enabled?: boolean };

type MaybeTheme = Partial<{
  font: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  accentColor: string;
  accent: string;
  canEnlarge: boolean;
  appearanceEffect: boolean;
}>;

type MaybePerson = Partial<{
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  fatherDeceased: boolean;
  motherDeceased: boolean;
  fatherDead: boolean;
  motherDead: boolean;
  isFatherDead: boolean;
  isMotherDead: boolean;
}>;

type MaybeGreeting = Partial<{
  title: string;
  body: string;
  ordered: boolean;
  sort: string;
}>;

type MaybeCeremony = Partial<{
  date: string;
  time: string;
  hour: number;
  minute: number;
  representDDay: boolean;
  showDDay: boolean;
  showDday: boolean;
}>;

type MaybePlace = Partial<{
  venueName: string;
  hallInfo: string;
  showMap: boolean;
}>;

type PhotoItem =
  | string
  | {
      key?: string;
      contentType?: string;
    };

type MaybeGalleryLocal = Partial<{
  title: string;
  layout: string;
  enablePopup: boolean;
  photos: PhotoItem[];
}>;

export function useInviteDraftAutosave(
  draftId: number,
  form: InviteForm,
  place: PlaceSectionValue,
  gallery: GallerySectionValue,
  opts: Options = {},
) {
  const { enabled = true } = opts;
  const qc = useQueryClient();

  const canSave = enabled && Number.isFinite(draftId) && draftId > 0;
  const fTheme = form.theme;
  const fGroom = form.groom;
  const fBride = form.bride;
  const fOrder = form.order;
  const fGreeting = form.greeting;
  const fCeremony = form.ceremony;
  const fBrideFirst =
    (form as unknown as { brideFirst?: boolean }).brideFirst ?? undefined;

  const latestRef = useRef<{
    form: InviteForm;
    place: PlaceSectionValue;
    gallery: GallerySectionValue;
  }>({
    form,
    place,
    gallery,
  });
  useEffect(() => {
    latestRef.current = { form, place, gallery };
  }, [form, place, gallery]);

  const toThemeDraft = (src: unknown): ThemeDraft => {
    const t = (src ?? {}) as MaybeTheme;
    return {
      font: str(t.font ?? t.fontFamily),
      fontSize: str(t.fontSize ?? t.fontWeight),
      accentColor: str(t.accentColor ?? t.accent),
      template: 'FILM',
      canEnlarge: bool(t.canEnlarge),
      appearanceEffect: bool(t.appearanceEffect),
    };
  };

  const toBasicDraft = (
    groomSrc: unknown,
    brideSrc: unknown,
    orderSrc: unknown,
    brideFirstFallback?: boolean,
  ): BasicInformationDraft => {
    const g = (groomSrc ?? {}) as MaybePerson;
    const b = (brideSrc ?? {}) as MaybePerson;
    const order = str(orderSrc);

    const brideFirst =
      order === 'BRIDE_FIRST' ||
      order === 'BRIDE' ||
      order === 'BRIDE_FIRST_ORDER' ||
      !!brideFirstFallback;

    return {
      groomFirstName: str(g.firstName),
      groomLastName: str(g.lastName),
      groomFatherName: str(g.fatherName ?? ''),
      groomMotherName: str(g.motherName ?? ''),
      brideFirstName: str(b.firstName),
      brideLastName: str(b.lastName),
      brideFatherName: str(b.fatherName ?? ''),
      brideMotherName: str(b.motherName ?? ''),
      groomFatherDead: bool(g.fatherDeceased ?? g.fatherDead ?? g.isFatherDead),
      groomMotherDead: bool(g.motherDeceased ?? g.motherDead ?? g.isMotherDead),
      brideFatherDead: bool(b.fatherDeceased ?? b.fatherDead ?? b.isFatherDead),
      brideMotherDead: bool(b.motherDeceased ?? b.motherDead ?? b.isMotherDead),
      brideFirst,
    };
  };

  const toDateDraft = (src: unknown): MarriageDateDraft => {
    const c = (src ?? {}) as MaybeCeremony;
    const hour = num(c.hour, NaN);
    const minute = num(c.minute, NaN);
    const time =
      str(c.time) ||
      (Number.isFinite(hour) && Number.isFinite(minute)
        ? `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
        : '');
    return {
      marriageDate: str(c.date),
      marriageTime: time,
      representDDay: bool(c.representDDay ?? c.showDDay ?? c.showDday, true),
    };
  };

  const toPlaceDraft = (src: unknown): MarriagePlaceDraft => {
    const p = (src ?? {}) as MaybePlace;
    return {
      vendorName: str(p.venueName),
      floorAndHall: str(p.hallInfo),
      drawSketchMap: bool(p.showMap),
    };
  };

  const toGalleryMetaDraft = (src: unknown): GalleryMetaDraft => {
    const g = (src ?? {}) as MaybeGalleryLocal;
    return {
      galleryTitle: str(g.title, '갤러리'),
      arrangement: str(g.layout) === 'GRID' ? 'GRID' : 'SWIPE',
      popUpViewer: bool(g.enablePopup, true),
    };
  };

  const toMediaList = (
    photos: PhotoItem[],
  ): { mediaKey: string; contentType: string; sortOrder: number }[] =>
    photos.map((p, i) =>
      typeof p === 'string'
        ? { mediaKey: p, contentType: '', sortOrder: i }
        : {
            mediaKey: str(p.key),
            contentType: str(p.contentType),
            sortOrder: i,
          },
    );

  const flush = useMemo<() => void>(() => {
    return () => {
      if (!canSave) return;

      const { form: f, place: pl, gallery: gal } = latestRef.current;

      const themeDraft = toThemeDraft(
        (f as unknown as { theme?: unknown }).theme,
      );
      const basicDraft = toBasicDraft(
        (f as unknown as { groom?: unknown }).groom,
        (f as unknown as { bride?: unknown }).bride,
        (f as unknown as { order?: unknown }).order,
        (f as unknown as { brideFirst?: boolean }).brideFirst,
      );
      const greetSrc =
        (f as unknown as { greeting?: MaybeGreeting }).greeting ?? {};
      const greetingsDraft: GreetingsDraft = {
        greetingsTitle: str(greetSrc.title),
        greetingsContent: str(greetSrc.body),
        greetingsSortInOrder:
          typeof greetSrc.ordered === 'boolean'
            ? greetSrc.ordered
            : ['순서대로', 'ORDERED', 'ASC', 'TRUE'].includes(
                str(greetSrc.sort).toUpperCase(),
              ),
      };
      const dateDraft = toDateDraft(
        (f as unknown as { ceremony?: unknown }).ceremony,
      );
      const placeDraft = toPlaceDraft(pl as unknown);
      const galleryDraft = toGalleryMetaDraft(gal as unknown);
      const photos = Array.isArray(
        (gal as unknown as MaybeGalleryLocal)?.photos,
      )
        ? ((gal as unknown as MaybeGalleryLocal).photos as PhotoItem[])
        : [];
      const mediaList = toMediaList(photos);

      qc.setQueryData(draftFieldKey(draftId, 'theme'), themeDraft);
      qc.setQueryData(draftFieldKey(draftId, 'basicInformation'), basicDraft);
      qc.setQueryData(draftFieldKey(draftId, 'greetings'), greetingsDraft);
      qc.setQueryData(draftFieldKey(draftId, 'marriageDate'), dateDraft);
      qc.setQueryData(draftFieldKey(draftId, 'marriagePlace'), placeDraft);
      qc.setQueryData(draftFieldKey(draftId, 'gallery'), galleryDraft);
      qc.setQueryData(galleryKey(draftId), mediaList);

      try {
        const payload = {
          theme: themeDraft,
          basicInformation: basicDraft,
          greetings: greetingsDraft,
          marriageDate: dateDraft,
          marriagePlace: placeDraft,
          gallery: galleryDraft,
          mediaList,
          updatedAt: Date.now(),
        };
        localStorage.setItem(`inviteDraft:${draftId}`, JSON.stringify(payload));
      } catch {
        // ignore
      }
    };
  }, [canSave, draftId, qc]);

  // theme
  useEffect(() => {
    if (!canSave) return;
    qc.setQueryData(
      draftFieldKey(draftId, 'theme'),
      toThemeDraft((fTheme as unknown) ?? {}),
    );
  }, [qc, draftId, canSave, fTheme]);

  // basicInformation
  useEffect(() => {
    if (!canSave) return;
    qc.setQueryData(
      draftFieldKey(draftId, 'basicInformation'),
      toBasicDraft(fGroom, fBride, fOrder, fBrideFirst),
    );
  }, [qc, draftId, canSave, fGroom, fBride, fOrder, fBrideFirst]);

  // greetings
  useEffect(() => {
    if (!canSave) return;
    const g = (fGreeting ?? {}) as MaybeGreeting;
    const v: GreetingsDraft = {
      greetingsTitle: str(g.title),
      greetingsContent: str(g.body),
      greetingsSortInOrder:
        typeof g.ordered === 'boolean'
          ? g.ordered
          : ['순서대로', 'ORDERED', 'ASC', 'TRUE'].includes(
              str(g.sort).toUpperCase(),
            ),
    };
    qc.setQueryData(draftFieldKey(draftId, 'greetings'), v);
  }, [qc, draftId, canSave, fGreeting]);

  // marriageDate
  useEffect(() => {
    if (!canSave) return;
    qc.setQueryData(
      draftFieldKey(draftId, 'marriageDate'),
      toDateDraft(fCeremony),
    );
  }, [qc, draftId, canSave, fCeremony]);

  // marriagePlace
  useEffect(() => {
    if (!canSave) return;
    qc.setQueryData(
      draftFieldKey(draftId, 'marriagePlace'),
      toPlaceDraft(place as unknown),
    );
  }, [qc, draftId, canSave, place]);

  // gallery meta
  useEffect(() => {
    if (!canSave) return;
    qc.setQueryData(
      draftFieldKey(draftId, 'gallery'),
      toGalleryMetaDraft(gallery as unknown),
    );
  }, [qc, draftId, canSave, gallery]);

  // media list
  useEffect(() => {
    if (!canSave) return;

    const g = gallery as unknown as MaybeGalleryLocal;
    const photos = Array.isArray(g.photos) ? (g.photos as PhotoItem[]) : [];
    const existed =
      qc.getQueryData<
        { mediaKey: string; contentType?: string; sortOrder: number }[]
      >(galleryKey(draftId)) ?? [];
    const existedMap = new Map(
      existed.map((m) => [m.mediaKey, m.contentType ?? '']),
    );
    const list = toMediaList(photos).map((m) => ({
      ...m,
      contentType: m.contentType || existedMap.get(m.mediaKey) || '',
    }));

    qc.setQueryData(galleryKey(draftId), list);
  }, [qc, draftId, canSave, gallery]);

  useEffect(() => {
    if (!canSave) return;

    const onPageHide = () => flush();
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    const onBeforeUnload = () => flush();

    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('beforeunload', onBeforeUnload);
      flush();
    };
  }, [canSave, flush]);

  return { saveNow: flush };
}
