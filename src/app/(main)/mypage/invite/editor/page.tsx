'use client';

import { useRouter } from 'next/navigation';
import { useState, type ComponentProps } from 'react';
import { defaultInviteForm, type InviteForm } from '@/types/invite';
import Header from '@/components/common/monocules/Header';
import ThemaSection from '@/components/invitation/section/ThemaSection';
import BasicInfoSection from '@/components/invitation/section/BasicInfoSection';
import MessageSection from '@/components/invitation/section/MessageSection';
import DateSection from '@/components/invitation/section/DateSection';
import PlaceSection, {
  type PlaceSectionValue,
} from '@/components/invitation/section/PlaceSection';
import Button from '@/components/common/atomic/Button';
import SvgObject from '@/components/common/atomic/SvgObject';
import clsx from 'clsx';
import GallerySection, {
  type GallerySectionValue,
} from '@/components/invitation/section/GallerySection';
const DEFAULT_PLACE: PlaceSectionValue = {
  venueName: '',
  hallInfo: '',
  showMap: true,
};
type ThemaValue = ComponentProps<typeof ThemaSection>['value'];
type ThemaOnChange = ComponentProps<typeof ThemaSection>['onChange'];
type BasicValue = ComponentProps<typeof BasicInfoSection>['value'];
type BasicOnChange = ComponentProps<typeof BasicInfoSection>['onChange'];
type MessageValue = ComponentProps<typeof MessageSection>['value'];
type MessageOnChange = ComponentProps<typeof MessageSection>['onChange'];
type CeremonyValue = ComponentProps<typeof DateSection>['value'];
type CeremonyOnChange = ComponentProps<typeof DateSection>['onChange'];
export default function InviteEditorPage() {
  const router = useRouter();
  const [form, setForm] = useState<InviteForm>(defaultInviteForm);
  const [saving, setSaving] = useState(false);
  const [placeLocal, setPlaceLocal] =
    useState<PlaceSectionValue>(DEFAULT_PLACE);
  const [galleryLocal, setGalleryLocal] = useState<GallerySectionValue>({
    layout: 'GRID',
    enablePopup: true,
    photos: [],
  });
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

  const onSubmit = async () => {
    setSaving(true);
    try {
      router.replace('/mypage/invite/view');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-96 bg-background">
      <Header value="청첩장 제작" onBack={() => router.back()} showBack />
      <section className="mx-auto max-w-96 px-5 pt-2 flex flex-col items-center gap-3">
        {/* value도 컴포넌트 기대 타입으로 단언 (any 사용 X) */}
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
            setForm((f) => ({
              ...f,
              gallery: next.photos,
            }));
          }}
          uploadDomain="REVIEW"
          uploadDomainId={123}
          maxTotal={27}
        />
        <PlainCollapsible title="엔딩사진/문구" />
        <PlainCollapsible title="계좌번호" />
        <PlainCollapsible title="배경음악/파티클" />
        <div className="w-80 mx-auto pt-15 pb-6">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            fullWidth
            size="lg"
          >
            {saving ? '제작 중…' : '제작하기'}
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
      className="w-80 rounded-lg outline-[1.2px] outline-offset-[-1.2px] outline-box-line overflow-hidden"
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
          width={20}
          height={20}
          className={clsx(
            'transition-transform opacity-60',
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
