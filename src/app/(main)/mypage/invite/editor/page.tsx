'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
  const setTheme = (v: any) => setForm((f) => ({ ...f, theme: v }));
  const setBasic = (v: any) =>
    setForm((f) => ({ ...f, bride: v.bride, groom: v.groom, order: v.order }));
  const setMessage = (v: any) => setForm((f) => ({ ...f, greeting: v }));
  const setCeremony = (v: any) => setForm((f) => ({ ...f, ceremony: v }));

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
        <ThemaSection value={form.theme as any} onChange={setTheme} />
        <BasicInfoSection
          defaultOpen={false}
          value={{
            bride: form.bride as any,
            groom: form.groom as any,
            order: form.order as any,
          }}
          onChange={setBasic}
        />
        <MessageSection
          defaultOpen={false}
          value={(form as any).greeting ?? { title: '', body: '' }}
          onChange={setMessage}
        />
        <DateSection
          defaultOpen={false}
          value={form.ceremony as any}
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
