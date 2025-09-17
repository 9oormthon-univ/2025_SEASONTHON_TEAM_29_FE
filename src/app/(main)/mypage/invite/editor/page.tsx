'use client';

import Button from '@/components/common/atomic/Button';
import SvgObject from '@/components/common/atomic/SvgObject';
import Header from '@/components/common/monocules/Header';
import BasicInfoSection from '@/components/invitation/section/BasicInfoSection';
import DateSection from '@/components/invitation/section/DateSection';
import GallerySection, {
  type GallerySectionValue,
} from '@/components/invitation/section/GallerySection';
import MessageSection from '@/components/invitation/section/MessageSection';
import PlaceSection, {
  type PlaceSectionValue,
} from '@/components/invitation/section/PlaceSection';
import ThemaSection from '@/components/invitation/section/ThemaSection';
import { defaultInviteForm, type InviteForm } from '@/types/invite';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useState, type ComponentProps } from 'react';
import { useCreateInvitation } from '@/hooks/useCreateInvitation';
import { useSearchParams } from 'next/navigation';
import { useStagedInvitationMedia } from '@/hooks/useStagedInvitationMedia';
import { toInvitationPayload } from '@/lib/invitationAdapter';
import { useQueryClient } from '@tanstack/react-query';
import {
  buildInvitationPayload,
  clearDraftCache,
} from '@/lib/buildInvitationPayload';
import type { MediaItem } from '@/types/invitation';

const DEFAULT_PLACE: PlaceSectionValue = {
  venueName: '',
  hallInfo: '',
  showMap: true,
};

export default function InviteEditorPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const draftId = Number(sp.get('draft') ?? '0');

  const [form, setForm] = useState<InviteForm>(defaultInviteForm);
  const [saving, setSaving] = useState(false);
  const [placeLocal, setPlaceLocal] =
    useState<PlaceSectionValue>(DEFAULT_PLACE);
  const [galleryLocal, setGalleryLocal] = useState<GallerySectionValue>({
    layout: 'GRID',
    enablePopup: true,
    photos: [],
  });

  const { mutateAsync, isPending } = useCreateInvitation();
  const { staged, clear } = useStagedInvitationMedia(draftId);
  type ThemaValue = ComponentProps<typeof ThemaSection>['value'];
  type ThemaOnChange = ComponentProps<typeof ThemaSection>['onChange'];
  type BasicValue = ComponentProps<typeof BasicInfoSection>['value'];
  type BasicOnChange = ComponentProps<typeof BasicInfoSection>['onChange'];
  type MessageValue = ComponentProps<typeof MessageSection>['value'];
  type MessageOnChange = ComponentProps<typeof MessageSection>['onChange'];
  type CeremonyValue = ComponentProps<typeof DateSection>['value'];
  type CeremonyOnChange = ComponentProps<typeof DateSection>['onChange'];

  const setTheme: ThemaOnChange = (v) =>
    setForm((f) => ({ ...f, theme: v as unknown as InviteForm['theme'] }));
  const setBasic: BasicOnChange = (v) => {
    const { bride, groom, order } = v as unknown as Pick<
      InviteForm,
      'bride' | 'groom' | 'order'
    >;
    setForm((f) => ({ ...f, bride, groom, order }));
  };
  const setMessage: MessageOnChange = (v) =>
    setForm((f) => ({
      ...f,
      greeting: v as unknown as InviteForm['greeting'],
    }));
  const setCeremony: CeremonyOnChange = (v) =>
    setForm((f) => ({
      ...f,
      ceremony: v as unknown as InviteForm['ceremony'],
    }));

  const qc = useQueryClient();

  const onSubmit = async () => {
    setSaving(true);
    try {
      const payload = buildInvitationPayload({
        form,
        placeLocal,
        galleryLocal,
        staged: {
          mainMedia: staged.mainMedia ?? undefined,
          filmMedia: staged.filmMedia ?? undefined,
          ticketMedia: staged.ticketMedia ?? undefined,
        },
        draftId,
        qc,
      });
      console.log('[SUBMIT payload]', payload);

      await mutateAsync(payload);
      clear();
      clearDraftCache(qc, draftId);

      router.replace('/mypage/invite/view');
    } catch (e) {
      console.error(e);
      alert('청첩장 저장에 실패했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-96 bg-background">
      <Header
        value="청첩장 제작"
        showBack
        onBack={() => history.back()}
        rightSlot={
          <a href="editor/view" className="text-xs text-primary-500 underline">
            미리보기
          </a>
        }
      />
      <section className="mx-auto max-w-100 px-2 pt-2 flex flex-col items-center gap-3">
        <ThemaSection
          value={form.theme as unknown as ThemaValue}
          onChange={setTheme}
        />
        <BasicInfoSection
          defaultOpen={false}
          value={
            {
              bride: form.bride,
              groom: form.groom,
              order: form.order,
            } as unknown as BasicValue
          }
          onChange={setBasic}
        />
        <MessageSection
          defaultOpen={false}
          value={
            (form.greeting ?? {
              title: '',
              body: '',
            }) as unknown as MessageValue
          }
          onChange={setMessage}
        />
        <DateSection
          defaultOpen={false}
          value={form.ceremony as unknown as CeremonyValue}
          onChange={setCeremony}
        />
        <PlaceSection
          defaultOpen={false}
          value={placeLocal}
          onChange={setPlaceLocal}
        />

        <PlainCollapsible title="교통수단" />
        <GallerySection
          value={galleryLocal}
          onChange={(next) => {
            setGalleryLocal(next);
            setForm((f) => ({ ...f, gallery: next.photos }));
          }}
          uploadDomain="REVIEW"
          uploadDomainId={123}
          maxTotal={27}
        />
        <PlainCollapsible title="엔딩사진/문구" />
        <PlainCollapsible title="계좌번호" />
        <PlainCollapsible title="배경음악/파티클" />

        <div className="w-90 mx-auto pt-15 pb-6">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={saving || isPending}
            fullWidth
            size="lg"
          >
            {saving || isPending ? '제작 중…' : '제작하기'}
          </Button>
        </div>
      </section>
    </main>
  );
}
function PlainCollapsible({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const headerId = `${title}-header`;
  const panelId = `${title}-panel`;

  return (
    <section
      className="w-90 rounded-lg outline-[1.2px] outline-offset-[-1.2px] outline-box-line overflow-hidden"
      aria-labelledby={headerId}
      data-open={open}
    >
      <button
        id={headerId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[52px] px-4 py-0 inline-flex items-center justify-between"
      >
        <span className="text-text--default text-sm font-semibold leading-normal">
          {title}
        </span>
        <SvgObject
          src="/icons/down.svg"
          alt=""
          width={12}
          height={6}
          className={clsx(
            'shrink-0 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div id={panelId} role="region" aria-labelledby={headerId}>
          <Hr />
          <div className="px-4 pt-3 pb-4">{children}</div>
        </div>
      )}
    </section>
  );
}

function Hr({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'w-full h-0 outline-[0.5px] outline-offset-[-0.25px] outline-box-line',
        className,
      )}
    />
  );
}
