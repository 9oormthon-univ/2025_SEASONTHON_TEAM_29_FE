'use client';

import { useEffect, useRef, useMemo } from 'react';
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
  const latestRef = useRef({ form, place, gallery });
  useEffect(() => {
    latestRef.current = { form, place, gallery };
  }, [form, place, gallery]);
  const flush = useMemo(() => {
    const saveTheme = (t: any): ThemeDraft => ({
      font: str(t.font ?? t.fontFamily),
      fontSize: str(t.fontSize ?? t.fontWeight),
      accentColor: str(t.accentColor ?? t.accent),
      template: 'FILM',
      canEnlarge: bool(t.canEnlarge),
      appearanceEffect: bool(t.appearanceEffect),
    });

    const saveBasic = (g: any, b: any, order: any): BasicInformationDraft => ({
      groomFirstName: str(g.firstName ?? g.first),
      groomLastName: str(g.lastName ?? g.last),
      groomFatherName: str(g.fatherName ?? g.father),
      groomMotherName: str(g.motherName ?? g.mother),
      brideFirstName: str(b.firstName ?? b.first),
      brideLastName: str(b.lastName ?? b.last),
      brideFatherName: str(b.fatherName ?? b.father),
      brideMotherName: str(b.motherName ?? b.mother),
      groomFatherDead: bool(g.fatherDeceased ?? g.fatherDead ?? g.isFatherDead),
      groomMotherDead: bool(g.motherDeceased ?? g.motherDead ?? g.isMotherDead),
      brideFatherDead: bool(b.fatherDeceased ?? b.fatherDead ?? b.isFatherDead),
      brideMotherDead: bool(b.motherDeceased ?? b.motherDead ?? b.isMotherDead),
      brideFirst:
        str(order) === 'BRIDE_FIRST' ||
        str(order) === 'BRIDE' ||
        str(order) === 'BRIDE_FIRST_ORDER' ||
        bool((latestRef.current.form as any).brideFirst),
    });

    const saveDate = (c: any): MarriageDateDraft => {
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

    const savePlace = (p: any): MarriagePlaceDraft => ({
      vendorName: str(p?.venueName),
      floorAndHall: str(p?.hallInfo),
      drawSketchMap: bool(p?.showMap),
    });

    const saveGalleryMeta = (g: any): GalleryMetaDraft => ({
      galleryTitle: str(g?.title, '갤러리'),
      arrangement: str(g?.layout) === 'GRID' ? 'GRID' : 'SWIPE',
      popUpViewer: bool(g?.enablePopup, true),
    });

    const toMediaList = (photos: any[]) =>
      photos.map((p, i) =>
        typeof p === 'string'
          ? { mediaKey: p, contentType: '', sortOrder: i }
          : {
              mediaKey: str(p?.key),
              contentType: str(p?.contentType),
              sortOrder: i,
            },
      );

    return () => {
      const { form, place, gallery } = latestRef.current;
      if (!canSave) return;
      qc.setQueryData(
        draftFieldKey(draftId, 'theme'),
        saveTheme((form as any).theme ?? {}),
      );
      qc.setQueryData(
        draftFieldKey(draftId, 'basicInformation'),
        saveBasic(
          (form as any).groom ?? {},
          (form as any).bride ?? {},
          (form as any).order,
        ),
      );
      qc.setQueryData(draftFieldKey(draftId, 'greetings'), {
        greetingsTitle: str((form as any).greeting?.title),
        greetingsContent: str((form as any).greeting?.body),
        greetingsSortInOrder: true,
      } as GreetingsDraft);
      qc.setQueryData(
        draftFieldKey(draftId, 'marriageDate'),
        saveDate((form as any).ceremony ?? {}),
      );
      qc.setQueryData(
        draftFieldKey(draftId, 'marriagePlace'),
        savePlace(place),
      );
      qc.setQueryData(
        draftFieldKey(draftId, 'gallery'),
        saveGalleryMeta(gallery),
      );

      const photos = Array.isArray((gallery as any)?.photos)
        ? (gallery as any).photos
        : [];
      const list = toMediaList(photos);
      qc.setQueryData(galleryKey(draftId), list);
      try {
        const payload = {
          theme: qc.getQueryData(draftFieldKey(draftId, 'theme')),
          basicInformation: qc.getQueryData(
            draftFieldKey(draftId, 'basicInformation'),
          ),
          greetings: qc.getQueryData(draftFieldKey(draftId, 'greetings')),
          marriageDate: qc.getQueryData(draftFieldKey(draftId, 'marriageDate')),
          marriagePlace: qc.getQueryData(
            draftFieldKey(draftId, 'marriagePlace'),
          ),
          gallery: qc.getQueryData(draftFieldKey(draftId, 'gallery')),
          mediaList: qc.getQueryData(galleryKey(draftId)),
          updatedAt: Date.now(),
        };
        localStorage.setItem(`inviteDraft:${draftId}`, JSON.stringify(payload));
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSave, draftId, qc]);
  useEffect(() => {
    if (!canSave) return;
    const t: any = (form as any).theme ?? {};
    const v: ThemeDraft = {
      font: str(t.font ?? t.fontFamily),
      fontSize: str(t.fontSize ?? t.fontWeight),
      accentColor: str(t.accentColor ?? t.accent),
      template: 'FILM',
      canEnlarge: bool(t.canEnlarge),
      appearanceEffect: bool(t.appearanceEffect),
    };
    qc.setQueryData(draftFieldKey(draftId, 'theme'), v);
  }, [qc, draftId, canSave, (form as any).theme]);

  useEffect(() => {
    if (!canSave) return;
    const g: any = (form as any).groom ?? {};
    const b: any = (form as any).bride ?? {};
    const order: any = (form as any).order;
    const v: BasicInformationDraft = {
      groomFirstName: str(g.firstName ?? g.first),
      groomLastName: str(g.lastName ?? g.last),
      groomFatherName: str(g.fatherName ?? g.father),
      groomMotherName: str(g.motherName ?? g.mother),
      brideFirstName: str(b.firstName ?? b.first),
      brideLastName: str(b.lastName ?? b.last),
      brideFatherName: str(b.fatherName ?? b.father),
      brideMotherName: str(b.motherName ?? b.mother),
      groomFatherDead: bool(g.fatherDeceased ?? g.fatherDead ?? g.isFatherDead),
      groomMotherDead: bool(g.motherDeceased ?? g.motherDead ?? g.isMotherDead),
      brideFatherDead: bool(b.fatherDeceased ?? b.fatherDead ?? b.isFatherDead),
      brideMotherDead: bool(b.motherDeceased ?? b.motherDead ?? b.isMotherDead),
      brideFirst:
        str(order) === 'BRIDE_FIRST' ||
        str(order) === 'BRIDE' ||
        str(order) === 'BRIDE_FIRST_ORDER' ||
        bool((form as any).brideFirst),
    };
    qc.setQueryData(draftFieldKey(draftId, 'basicInformation'), v);
  }, [
    qc,
    draftId,
    canSave,
    (form as any).groom,
    (form as any).bride,
    (form as any).order,
  ]);

  useEffect(() => {
    if (!canSave) return;
    const g: any = (form as any).greeting ?? {};

    const ordered =
      typeof g.ordered === 'boolean'
        ? g.ordered
        : ['순서대로', 'ORDERED', 'ASC', 'TRUE'].includes(
            String(g.sort || '').toUpperCase(),
          );

    const v: GreetingsDraft = {
      greetingsTitle: str(g.title),
      greetingsContent: str(g.body),
      greetingsSortInOrder: ordered,
    };

    qc.setQueryData(draftFieldKey(draftId, 'greetings'), v);

    if (process.env.NODE_ENV !== 'production') {
      console.log('[AUTOSAVE:greetings]', v, '(from form.greeting =', g, ')');
    }
  }, [
    qc,
    draftId,
    canSave,
    (form as any).greeting?.title,
    (form as any).greeting?.body,
    (form as any).greeting?.ordered,
    (form as any).greeting?.sort,
  ]);

  useEffect(() => {
    if (!canSave) return;
    const c: any = (form as any).ceremony ?? {};
    const hour = num(c.hour, NaN);
    const minute = num(c.minute, NaN);
    const time =
      str(c.time) ||
      (Number.isFinite(hour) && Number.isFinite(minute)
        ? `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
        : '');
    const v: MarriageDateDraft = {
      marriageDate: str(c.date),
      marriageTime: time,
      representDDay: bool(c.representDDay ?? c.showDDay ?? c.showDday, true),
    };
    qc.setQueryData(draftFieldKey(draftId, 'marriageDate'), v);
  }, [qc, draftId, canSave, (form as any).ceremony]);

  useEffect(() => {
    if (!canSave) return;
    const v: MarriagePlaceDraft = {
      vendorName: str((place as any)?.venueName),
      floorAndHall: str((place as any)?.hallInfo),
      drawSketchMap: bool((place as any)?.showMap),
    };
    qc.setQueryData(draftFieldKey(draftId, 'marriagePlace'), v);
  }, [qc, draftId, canSave, place]);

  useEffect(() => {
    if (!canSave) return;
    const v: GalleryMetaDraft = {
      galleryTitle: str((gallery as any)?.title, '갤러리'),
      arrangement: str((gallery as any)?.layout) === 'GRID' ? 'GRID' : 'SWIPE',
      popUpViewer: bool((gallery as any)?.enablePopup, true),
    };
    qc.setQueryData(draftFieldKey(draftId, 'gallery'), v);
  }, [
    qc,
    draftId,
    canSave,
    (gallery as any)?.title,
    (gallery as any)?.layout,
    (gallery as any)?.enablePopup,
  ]);

  useEffect(() => {
    if (!canSave) return;

    const photos: any[] = Array.isArray((gallery as any)?.photos)
      ? (gallery as any).photos
      : [];

    const existed =
      qc.getQueryData<
        { mediaKey: string; contentType?: string; sortOrder: number }[]
      >(galleryKey(draftId)) ?? [];
    const existedMap = new Map(existed.map((m) => [m.mediaKey, m]));
    const list = photos.map((p, i) => {
      const key = typeof p === 'string' ? p : str(p?.key);
      const prev = existedMap.get(key);
      return {
        mediaKey: key,
        contentType:
          typeof p === 'string'
            ? (prev?.contentType ?? '')
            : str(p?.contentType) || prev?.contentType || '',
        sortOrder: i,
      };
    });
    qc.setQueryData(galleryKey(draftId), list);
  }, [qc, draftId, canSave, (gallery as any)?.photos]);

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
