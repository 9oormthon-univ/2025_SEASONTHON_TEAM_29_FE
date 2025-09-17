'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { InviteForm } from '@/types/invite';
import type { ComponentProps } from 'react';
import PlaceSection from '@/components/invitation/section/PlaceSection';
import GallerySection from '@/components/invitation/section/GallerySection';

type PlaceValue = ComponentProps<typeof PlaceSection>['value'];
type GalleryValue = ComponentProps<typeof GallerySection>['value'];

type LocalDraftSnapshot = {
  v: 1;
  updatedAt: number;
  form: Partial<InviteForm>;
  place: PlaceValue;
  gallery: GalleryValue;
};

const lsKey = (draftId: number) => `weddit:draft:${draftId}`;

export function loadLocalDraft(draftId: number): LocalDraftSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(lsKey(draftId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocalDraftSnapshot;
    if (parsed?.v === 1 && typeof parsed.updatedAt === 'number') return parsed;
  } catch {}
  return null;
}

export function clearLocalDraft(draftId: number) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(lsKey(draftId));
  } catch {}
}

export function applyLocalDraftIfNewer(opts: {
  draftId: number;
  currentUpdatedAt?: number;
  setForm: React.Dispatch<React.SetStateAction<InviteForm>>;
  setPlaceLocal: React.Dispatch<React.SetStateAction<PlaceValue>>;
  setGalleryLocal: React.Dispatch<React.SetStateAction<GalleryValue>>;
}): boolean {
  const snap = loadLocalDraft(opts.draftId);
  if (!snap) return false;

  const shouldApply =
    typeof opts.currentUpdatedAt === 'number'
      ? snap.updatedAt > opts.currentUpdatedAt
      : true;

  if (!shouldApply) return false;
  opts.setForm((prev) => ({ ...prev, ...snap.form }));
  opts.setPlaceLocal(snap.place);
  opts.setGalleryLocal(snap.gallery);
  return true;
}
export function useLocalDraftAutosave(opts: {
  enabled: boolean;
  draftId: number;
  form: InviteForm;
  place: PlaceValue;
  gallery: GalleryValue;
}) {
  const { enabled, draftId, form, place, gallery } = opts;
  const timerRef = useRef<number | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const payload: LocalDraftSnapshot | null = useMemo(() => {
    if (!Number.isFinite(draftId) || draftId <= 0) return null;
    return {
      v: 1,
      updatedAt: Date.now(),
      form: {
        theme: (form as any).theme,
        groom: (form as any).groom,
        bride: (form as any).bride,
        order: (form as any).order,
        greeting: (form as any).greeting,
        ceremony: (form as any).ceremony,
        gallery: (form as any).gallery,
      } as Partial<InviteForm>,
      place,
      gallery,
    };
  }, [draftId, form, place, gallery]);

  useEffect(() => {
    if (!enabled || !payload) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(lsKey(draftId), JSON.stringify(payload));
        setLastSavedAt(payload.updatedAt);
        console.log(
          '[LOCAL-AUTOSAVE] saved at',
          new Date(payload.updatedAt).toISOString(),
        );
      } catch (e) {
        console.warn('[LOCAL-AUTOSAVE] failed:', e);
      }
    }, 500) as unknown as number;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [enabled, draftId, payload]);

  return { lastSavedAt };
}
