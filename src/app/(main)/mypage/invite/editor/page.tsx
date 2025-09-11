'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { defaultInviteForm, type InviteForm } from '@/types/invite';
import Header from '@/components/common/monocules/Header';
import ThemeSection from '@/components/invitation/ThemeSection';
import BasicInfoSection from '@/components/invitation/BasicInfoSection';
import MessageSection from '@/components/invitation/MessageSection';
import DateSection from '@/components/invitation/DateSection';
import PlaceSection, {
  type PlaceSectionValue,
} from '@/components/invitation/PlaceSection';
import Button from '@/components/common/atomic/Button';

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

  const setTheme = (v: any) => setForm((f) => ({ ...f, theme: v }));

  const setBasic = (v: any) =>
    setForm((f) => ({
      ...f,
      bride: v.bride,
      groom: v.groom,
      order: v.order,
    }));
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
        <ThemeSection value={form.theme as any} onChange={setTheme} />
        <BasicInfoSection
          value={{
            bride: form.bride as any,
            groom: form.groom as any,
            order: form.order as any,
          }}
          onChange={setBasic}
        />
        <MessageSection
          value={(form as any).greeting ?? { title: '', body: '' }}
          onChange={setMessage}
        />
        <DateSection value={form.ceremony as any} onChange={setCeremony} />
        <PlaceSection value={placeLocal} onChange={setPlaceLocal} />
        <div className="w-80 mx-auto pt-2 pb-6">
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
