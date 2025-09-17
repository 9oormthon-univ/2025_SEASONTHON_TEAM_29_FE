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

  const [payload, setPayload] = useState<InvitationApi['data'] | null>(null);

  useEffect(() => {
    if (!Number.isFinite(draftId) || draftId <= 0) return;
    const theme = qc.getQueryData<ThemeDraft>(draftFieldKey(draftId, 'theme'));
    const basic = qc.getQueryData<BasicInformationDraft>(
      draftFieldKey(draftId, 'basicInformation'),
    );
    const greet = qc.getQueryData<GreetingsDraft>(
      draftFieldKey(draftId, 'greetings'),
    );
    const mdate = qc.getQueryData<MarriageDateDraft>(
      draftFieldKey(draftId, 'marriageDate'),
    );
    const mplace = qc.getQueryData<MarriagePlaceDraft>(
      draftFieldKey(draftId, 'marriagePlace'),
    );
    const gmeta = qc.getQueryData<GalleryMetaDraft>(
      draftFieldKey(draftId, 'gallery'),
    );
    const mediaList =
      qc.getQueryData<{ mediaKey: string; sortOrder: number }[]>(
        galleryKey(draftId),
      ) ?? [];
    if (!basic || !greet || !mdate || !mplace) {
      try {
        const raw = localStorage.getItem(`inviteDraft:${draftId}`);
        if (raw) {
          const json = JSON.parse(raw);
          if (!theme && json.theme) json.theme satisfies ThemeDraft;
          if (!basic && json.basicInformation)
            json.basicInformation satisfies BasicInformationDraft;
          if (!greet && json.greetings) json.greetings satisfies GreetingsDraft;
          if (!mdate && json.marriageDate)
            json.marriageDate satisfies MarriageDateDraft;
          if (!mplace && json.marriagePlace)
            json.marriagePlace satisfies MarriagePlaceDraft;
        }
      } catch {}
    }
    const b = basic ?? {
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

    const g = greet ?? {
      greetingsTitle: '',
      greetingsContent: '',
      greetingsSortInOrder: true,
    };

    const md = mdate ?? {
      marriageDate: new Date().toISOString().slice(0, 10),
      marriageTime: '12:00',
      representDDay: true,
    };

    const mp = mplace ?? {
      vendorName: '',
      floorAndHall: '',
      drawSketchMap: true,
      address: '',
      lat: 0,
      lng: 0,
    };
    const galleryUrls = [...mediaList]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((m) => toMediaUrl(m.mediaKey)!)
      .filter(Boolean);
    const mainMediaUrl = toMediaUrl(staged.mainMedia?.mediaKey ?? null);
    const filmMediaUrl = [
      toMediaUrl(staged.filmMedia?.[0]?.mediaKey ?? null),
      toMediaUrl(staged.filmMedia?.[1]?.mediaKey ?? null),
      toMediaUrl(staged.filmMedia?.[2]?.mediaKey ?? null),
    ].filter((u): u is string => !!u);
    const ticketMediaUrl = toMediaUrl(staged.ticketMedia?.mediaKey ?? null);
    const assembled: InvitationApi['data'] = {
      basicInformation: b,
      greetings: g,
      marriageDate: md,
      marriagePlace: mp,
      mainMediaUrl: mainMediaUrl || null,
      filmMediaUrl,
      ticketMediaUrl: ticketMediaUrl || null,
      mediaUrls: galleryUrls,
      theme: theme ?? {
        font: 'Pretendard',
        fontSize: '보통',
        accentColor: '#000000',
        template: 'FILM',
        canEnlarge: false,
        appearanceEffect: false,
      },
      gallery: gmeta ?? {
        galleryTitle: '갤러리',
        arrangement: 'GRID',
        popUpViewer: true,
      },
    } as any;

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
