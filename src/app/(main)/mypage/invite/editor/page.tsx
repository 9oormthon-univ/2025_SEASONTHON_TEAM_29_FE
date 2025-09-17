'use client';

import Button from '@/components/common/atomic/Button';
import SvgObject from '@/components/common/atomic/SvgObject';
import Header from '@/components/common/monocules/Header';
import BasicInfoSection from '@/components/invitation/section/BasicInfoSection';
import DateSection from '@/components/invitation/section/DateSection';
import GallerySection, {
  type GallerySectionValue,
} from '@/components/invitation/section/GallerySection';
import MessageSection, {
  type MessageSectionValue as MessageValue,
} from '@/components/invitation/section/MessageSection';
import PlaceSection, {
  type PlaceSectionValue,
} from '@/components/invitation/section/PlaceSection';
import ThemaSection from '@/components/invitation/section/ThemaSection';
import { defaultInviteForm, type InviteForm } from '@/types/invite';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type ComponentProps } from 'react';
import { useStagedInvitationMedia } from '@/hooks/useStagedInvitationMedia';
import { useSubmitInvitation } from '@/hooks/useSubmitInvitation';
import { useInviteDraftAutosave } from '@/hooks/useInviteDraftAutosave';
import { useRestoreInviteDraft } from '@/hooks/useRestoreInviteDraft';

const DEFAULT_PLACE: PlaceSectionValue = {
  venueName: '',
  hallInfo: '',
  showMap: true,
};

type ThemeValue = ComponentProps<typeof ThemaSection>['value'];
type ThemaOnChange = ComponentProps<typeof ThemaSection>['onChange'];
type BasicValue = ComponentProps<typeof BasicInfoSection>['value'];
type BasicOnChange = ComponentProps<typeof BasicInfoSection>['onChange'];
type CeremonyValue = ComponentProps<typeof DateSection>['value'];
type CeremonyOnChange = ComponentProps<typeof DateSection>['onChange'];

interface GreetingLoose {
  title?: string;
  body?: string;
  ordered?: boolean;
  sort?: string;
}

export default function InviteEditorPage() {
  const sp = useSearchParams();
  const draftId = Number(sp.get('draft') ?? '0');

  const [form, setForm] = useState<InviteForm>(defaultInviteForm);
  const [placeLocal, setPlaceLocal] =
    useState<PlaceSectionValue>(DEFAULT_PLACE);
  const [galleryLocal, setGalleryLocal] = useState<GallerySectionValue>({
    layout: 'GRID',
    enablePopup: true,
    photos: [],
  });

  const { staged, clear } = useStagedInvitationMedia(draftId);
  const [hydrated, setHydrated] = useState(false);

  useRestoreInviteDraft({
    draftId,
    setForm,
    setPlaceLocal,
    setGalleryLocal,
    onDone: () => setHydrated(true),
  });

  const { saveNow } = useInviteDraftAutosave(
    draftId,
    form,
    placeLocal,
    galleryLocal,
    { enabled: hydrated },
  );

  const setTheme: ThemaOnChange = (v) =>
    setForm((f) => ({
      ...f,
      theme: v as unknown as InviteForm['theme'],
    }));

  const setBasic: BasicOnChange = (v) => {
    const { bride, groom, order } = v as unknown as Pick<
      InviteForm,
      'bride' | 'groom' | 'order'
    >;
    setForm((f) => ({ ...f, bride, groom, order }));
  };

  const g = form.greeting as unknown as GreetingLoose | undefined;
  const msgValue: MessageValue = {
    title: g?.title ?? '',
    body: g?.body ?? '',
    ordered:
      typeof g?.ordered === 'boolean'
        ? !!g.ordered
        : ['순서대로', 'ORDERED', 'ASC', 'TRUE'].includes(
            String(g?.sort || '').toUpperCase(),
          ),
  };

  const setCeremony: CeremonyOnChange = (v) =>
    setForm((f) => ({
      ...f,
      ceremony: v as unknown as InviteForm['ceremony'],
    }));

  const { submit, isSubmitting } = useSubmitInvitation({
    form,
    placeLocal,
    galleryLocal,
    staged: {
      mainMedia: staged.mainMedia ?? null,
      filmMedia: staged.filmMedia ?? null,
      ticketMedia: staged.ticketMedia ?? null,
    },
    draftId,
    clearStaged: clear,
    onError: (e) => {
      console.error(e);
      alert('청첩장 저장에 실패했어요. 잠시 후 다시 시도해 주세요.');
    },
  });

  const router = useRouter();

  return (
    <main className="mx-auto min-h-screen max-w-96 bg-background">
      <Header
        value="청첩장 제작"
        showBack
        onBack={() => history.back()}
        rightSlot={
          <button
            onClick={() => {
              saveNow();
              router.push(`/mypage/invite/editor/view?draft=${draftId}`);
            }}
            className="text-xs text-primary-500 underline"
          >
            미리보기
          </button>
        }
      />
      <section className="mx-auto max-w-100 px-2 pt-2 flex flex-col items-center gap-3">
        <ThemaSection
          value={form.theme as unknown as ThemeValue}
          onChange={setTheme}
          media={{
            films: staged.filmMedia,
            main: staged.mainMedia,
            ticket: staged.ticketMedia,
          }}
          linkTo={`/mypage/invite/editor/thema/1?draft=${draftId}`}
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
          value={msgValue}
          onChange={(next) =>
            setForm((f) => ({
              ...f,
              greeting: {
                title: next.title,
                body: next.body,
                ordered: next.ordered,
              } as unknown as InviteForm['greeting'],
            }))
          }
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
          linkTo={`/mypage/invite/editor/gallery?draft=${draftId}`}
        />
        <PlainCollapsible title="엔딩사진/문구" />
        <PlainCollapsible title="계좌번호" />
        <PlainCollapsible title="배경음악/파티클" />
        <div className="w-90 mx-auto pt-15 pb-6">
          <Button
            type="button"
            onClick={submit}
            disabled={isSubmitting}
            fullWidth
            size="lg"
          >
            {isSubmitting ? '제작 중…' : '제작하기'}
          </Button>
        </div>
      </section>
    </main>
  );
}

function PlainCollapsible({
  title,
  defaultOpen = false,
}: {
  title: string;
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
    </section>
  );
}
