'use client';

import Header from '@/components/common/monocules/Header';
import Step1 from '@/components/invitation/ThemaStep/Step1';
import Step2 from '@/components/invitation/ThemaStep/Step2';
import Step3 from '@/components/invitation/ThemaStep/Step3';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useStagedInvitationMedia } from '@/hooks/useStagedInvitationMedia';
import { useS3MultiUpload } from '@/hooks/useS3MultiUpload';
import ProgressBar from '@/components/common/atomic/ProgressBar';

export default function ThemaEditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const inviteId = Number(params.id);
  const sp = useSearchParams();

  const step = useMemo(() => {
    const n = Number(sp.get('step') ?? '1');
    return Number.isFinite(n) ? Math.min(Math.max(1, n), 3) : 1;
  }, [sp]);

  const [FirstPhoto, setFirstPhoto] = useState<File | null>(null);
  const [SecondPhotos, setSecondPhotos] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [ThirdPhoto, setThirdPhoto] = useState<File | null>(null);

  const { stageMainMedia, stageFilmMedia, stageTicketMedia } =
    useStagedInvitationMedia(inviteId);
  const { uploadAll, uploading, error } = useS3MultiUpload();

  const setSubAt = (i: number, f: File | null) =>
    setSecondPhotos((prev) => prev.map((v, idx) => (idx === i ? f : v)));

  const pushStep = (n: number) =>
    router.push(`/mypage/invite/editor/thema/${inviteId}?step=${n}`);

  const handleBack = () => {
    if (step > 1) pushStep(step - 1);
    else router.push('/mypage/invite/editor');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header value="청첩장 제작" showBack onBack={handleBack}>
        <div className="px-4">
          <ProgressBar step={step} total={3} className="mx-auto mt-[-2px]" />
        </div>
      </Header>

      {step === 1 && (
        <Step1
          file={FirstPhoto}
          onChangeFile={setFirstPhoto}
          onNext={async () => {
            if (!FirstPhoto || !Number.isFinite(inviteId) || uploading) return;
            const [res] = await uploadAll('INVITATION', inviteId, [FirstPhoto]);
            const item = {
              mediaKey: res.s3Key,
              contentType: res.contentType || FirstPhoto.type || '',
              sortOrder: 0,
            };
            const snap = stageMainMedia(item);
            console.log('[MAIN UPLOAD]', item);
            console.log('[SNAPSHOT AFTER MAIN]', snap);
            pushStep(2);
          }}
        />
      )}

      {step === 2 && (
        <Step2
          files={SecondPhotos}
          onChangeAt={setSubAt}
          onNext={async () => {
            if (!Number.isFinite(inviteId) || uploading) return;

            const pairs = SecondPhotos.map((f, i) => ({ f, i })).filter(
              (x) => !!x.f,
            ) as { f: File; i: number }[];

            if (pairs.length === 0) return;

            const files = pairs.map((p) => p.f);
            const results = await uploadAll('INVITATION', inviteId, files);

            const items = results.map((r, idx) => ({
              mediaKey: r.s3Key,
              contentType: r.contentType || files[idx].type || '',
              sortOrder: pairs[idx].i,
            }));

            const snap = stageFilmMedia(items);
            console.log('[FILM UPLOAD]', items);
            console.log('[SNAPSHOT AFTER FILM]', snap);

            pushStep(3);
          }}
        />
      )}

      {step === 3 && (
        <Step3
          files={ThirdPhoto}
          onChangeFile={setThirdPhoto}
          onNext={async () => {
            if (!ThirdPhoto || !Number.isFinite(inviteId) || uploading) return;
            const [res] = await uploadAll('INVITATION', inviteId, [ThirdPhoto]);
            const item = {
              mediaKey: res.s3Key,
              contentType: res.contentType || ThirdPhoto.type || '',
              sortOrder: 0,
            };
            const snap = stageTicketMedia(item);
            console.log('[TICKET UPLOAD]', item);
            console.log('[SNAPSHOT AFTER TICKET]', snap);

            router.push(`/mypage/invite/editor?draft=${inviteId}`);
          }}
        />
      )}

      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-red-600/90 px-3 py-2 text-white text-sm">
          업로드 실패: {error}
        </div>
      )}
    </div>
  );
}
