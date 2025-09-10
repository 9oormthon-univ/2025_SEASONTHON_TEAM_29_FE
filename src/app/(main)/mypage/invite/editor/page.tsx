// src/app/mypage/invite/editor/page.tsx
'use client';

import {
  defaultInviteForm,
  type InviteForm,
} from '@/types/invite';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Header from '@/components/common/monocules/Header';
import BasicInfoSection from '@/components/invite/BasicInfoSection';
import CeremonySection from '@/components/invite/CeremonySection';
import GreetingSection from '@/components/invite/GreetingSection';
import ThemeSection from '@/components/invite/ThemeSection';
// (+ VenueSection, TransportSection, GallerySection, EndingSection, AccountsSection, EffectsSection import)

export default function InviteEditorPage() {
  const router = useRouter();
  const [form, setForm] = useState<InviteForm>(defaultInviteForm);
  const [saving, setSaving] = useState(false);

  const setTheme    = (v: InviteForm['theme'])        => setForm(f => ({ ...f, theme: v }));
  const setGreeting = (v: InviteForm['greeting'])     => setForm(f => ({ ...f, greeting: v }));
  const setCeremony = (v: InviteForm['ceremony'])     => setForm(f => ({ ...f, ceremony: v }));
  const setPeople   = (p: Partial<Pick<InviteForm,'bride'|'groom'|'order'>>) =>
    setForm(f => ({ ...f, ...p }));

  const onSubmit = async () => {
    setSaving(true);
    try {
      // await createInvitation(form);
      router.replace('/mypage/invite/preview');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-96 bg-background">
      <Header value='청첩장 제작' onBack={()=>{router.back()}} showBack/>
        <section className="mx-auto max-w-96 px-5 pt-2">

        <ThemeSection value={form.theme} onChange={setTheme} />
        <BasicInfoSection bride={form.bride} groom={form.groom} order={form.order} onChange={setPeople} />
        <GreetingSection value={form.greeting} onChange={setGreeting} />
        <CeremonySection value={form.ceremony} onChange={setCeremony} />

        {/* TODO: VenueSection / TransportSection / GallerySection / EndingSection / AccountsSection / EffectsSection 추가 */}

        <button
          type="button"
          onClick={onSubmit}
          disabled={saving}
          className="sticky bottom-4 left-0 right-0 mx-auto block w-full max-w-96 rounded-xl bg-rose-400 py-4 text-white shadow-lg disabled:opacity-60"
        >
          {saving ? '제작 중…' : '제작하기'}
        </button>
      </section>
    </main>
  );
}