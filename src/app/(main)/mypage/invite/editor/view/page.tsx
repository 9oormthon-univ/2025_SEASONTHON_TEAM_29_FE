'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import InvitationPreview from '@/components/invitation/view/InvitationPreview';
import type { InvitationApi } from '@/types/invitation';

import {
  draftFieldKey,
  galleryKey,
  type BasicInformationDraft,
  type GreetingsDraft,
  type MarriageDateDraft,
  type MarriagePlaceDraft,
  type GalleryMetaDraft,
  type ThemeDraft,
} from '@/lib/buildInvitationPayload';

import { useStagedInvitationMedia } from '@/hooks/useStagedInvitationMedia';

type PreviewData = InvitationApi['data'];
type PreviewPlace = PreviewData['marriagePlace'];

type PersistedDraft = Partial<{
  theme: ThemeDraft;
  basicInformation: BasicInformationDraft;
  greetings: GreetingsDraft;
  marriageDate: MarriageDateDraft;
  marriagePlace: MarriagePlaceDraft &
    Partial<Pick<PreviewPlace, 'address' | 'lat' | 'lng'>>;
  gallery: GalleryMetaDraft;
  mediaList: { mediaKey: string; sortOrder: number }[];
}>;

const toMediaUrl = (key?: string | null) => {
  if (!key) return null;
  const CDN = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/$/, '');
  const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (CDN) return `${CDN}/${key}`;
  if (API) return `${API}/files/${encodeURIComponent(key)}`;
  return `/${key}`;
};

export default function Page() {
  const sp = useSearchParams();
  const draftId = Number(sp.get('draft') ?? '0');
  const qc = useQueryClient();
  const { staged } = useStagedInvitationMedia(draftId);

  const [payload, setPayload] = useState<PreviewData | null>(null);

  useEffect(() => {
    if (!Number.isFinite(draftId) || draftId <= 0) return;
    let theme = qc.getQueryData<ThemeDraft>(draftFieldKey(draftId, 'theme'));
    let basic = qc.getQueryData<BasicInformationDraft>(
      draftFieldKey(draftId, 'basicInformation'),
    );
    let greet = qc.getQueryData<GreetingsDraft>(
      draftFieldKey(draftId, 'greetings'),
    );
    let mdate = qc.getQueryData<MarriageDateDraft>(
      draftFieldKey(draftId, 'marriageDate'),
    );
    let mplaceDraft = qc.getQueryData<MarriagePlaceDraft>(
      draftFieldKey(draftId, 'marriagePlace'),
    );
    let gmetaDraft = qc.getQueryData<GalleryMetaDraft>(
      draftFieldKey(draftId, 'gallery'),
    );
    let mediaList =
      qc.getQueryData<{ mediaKey: string; sortOrder: number }[]>(
        galleryKey(draftId),
      ) ?? [];
    try {
      const raw = localStorage.getItem(`inviteDraft:${draftId}`);
      if (raw) {
        const json = JSON.parse(raw) as PersistedDraft;
        if (!theme && json.theme) theme = json.theme;
        if (!basic && json.basicInformation) basic = json.basicInformation;
        if (!greet && json.greetings) greet = json.greetings;
        if (!mdate && json.marriageDate) mdate = json.marriageDate;
        if (!mplaceDraft && json.marriagePlace)
          mplaceDraft = json.marriagePlace;
        if (mediaList.length === 0 && Array.isArray(json.mediaList)) {
          mediaList = json.mediaList;
        }
        if (!gmetaDraft && json.gallery) gmetaDraft = json.gallery;
      }
    } catch {
      // ignore
    }

    // 3) 미리보기에 맞는 형태로 안전하게 기본값 채우기
    const b: BasicInformationDraft = basic ?? {
      groomFirstName: '',
      groomLastName: '',
      groomFatherName: '',
      groomMotherName: '',
      brideFirstName: '',
      brideLastName: '',
      brideFatherName: '',
      brideMotherName: '',
      groomFatherDead: false,
      groomMotherDead: false,
      brideFatherDead: false,
      brideMotherDead: false,
      brideFirst: false,
    };

    const g: GreetingsDraft = greet ?? {
      greetingsTitle: '',
      greetingsContent: '',
      greetingsSortInOrder: true,
    };

    const md: MarriageDateDraft = mdate ?? {
      marriageDate: new Date().toISOString().slice(0, 10),
      marriageTime: '12:00',
      representDDay: true,
    };
    const mp: PreviewPlace = {
      vendorName: mplaceDraft?.vendorName ?? '',
      floorAndHall: mplaceDraft?.floorAndHall ?? '',
      drawSketchMap: mplaceDraft?.drawSketchMap ?? true,
      address:
        (mplaceDraft as Partial<PreviewPlace> | undefined)?.address ?? '',
      lat: (mplaceDraft as Partial<PreviewPlace> | undefined)?.lat ?? 0,
      lng: (mplaceDraft as Partial<PreviewPlace> | undefined)?.lng ?? 0,
    };

    const galleryUrls: string[] = [...mediaList]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((m) => toMediaUrl(m.mediaKey))
      .filter((u): u is string => !!u);

    const mainMediaUrl: string =
      toMediaUrl(staged.mainMedia?.mediaKey ?? null) ?? '/mock/main-sample.jpg';

    const filmMediaUrl: string[] = [
      toMediaUrl(staged.filmMedia?.[0]?.mediaKey ?? null),
      toMediaUrl(staged.filmMedia?.[1]?.mediaKey ?? null),
      toMediaUrl(staged.filmMedia?.[2]?.mediaKey ?? null),
    ].filter((u): u is string => !!u);

    const ticketMediaUrl: string =
      toMediaUrl(staged.ticketMedia?.mediaKey ?? null) ?? '';

    const themeValue: PreviewData['theme'] =
      (theme as PreviewData['theme']) ?? {
        font: 'Pretendard',
        fontSize: '보통',
        accentColor: '#000000',
        template: 'FILM',
        canEnlarge: false,
        appearanceEffect: false,
      };

    const galleryValue: PreviewData['gallery'] =
      (gmetaDraft as PreviewData['gallery']) ?? {
        galleryTitle: '갤러리',
        arrangement: 'GRID',
        popUpViewer: true,
      };

    const assembled: PreviewData = {
      id: 0,
      memberId: 0,
      ending: '',
      account: '',
      background: '',
      theme: themeValue,
      basicInformation: b,
      greetings: g,
      marriageDate: md,
      marriagePlace: mp,
      mainMediaUrl,
      filmMediaUrl,
      ticketMediaUrl,
      mediaUrls: galleryUrls,
      gallery: galleryValue,
    };

    setPayload(assembled);
  }, [draftId, qc, staged.mainMedia, staged.filmMedia, staged.ticketMedia]);

  if (!payload) {
    return (
      <div className="min-h-svh grid place-items-center text-white bg-[#090909]">
        미리보기 데이터를 준비하는 중…
      </div>
    );
  }

  return (
    <div className="min-h-svh w-full overflow-x-hidden overflow-y-auto bg-[#090909]">
      <InvitationPreview payload={payload} />
    </div>
  );
}
