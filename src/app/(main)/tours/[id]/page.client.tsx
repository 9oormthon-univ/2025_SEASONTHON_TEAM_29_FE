'use client';

import Header from '@/components/common/monocules/Header';
import Section from '@/components/common/Section';
import OptionPills from '@/components/tours/fitting/OptionPills';
import Preview from '@/components/tours/fitting/Preview';
import ThumbGrid from '@/components/tours/fitting/ThumbGrid';
import { dressLines, dressMaterials, dressNecklines } from '@/data/dressOptions';
import { useDressFitting } from '@/hooks/useDressFitting';
import {
  lineOrderFromId,
  materialOrderFromNames,
  neckOrderFromId,
} from '@/services/mappers/tourMappers';
import { saveDress } from '@/services/tours.api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DressFittingClient({ id }: { id: string }) {
  const { materials, toggleMaterial, neck, setNeck, line, setLine, canSave } =
    useDressFitting();
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const onSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      const body = {
        tourId: Number(id),
        materialOrder: materialOrderFromNames(materials),
        neckLineOrder: neckOrderFromId(neck?.id),
        lineOrder: lineOrderFromId(line?.id),
      };
      await saveDress(body);
      router.replace('/tours');
    } catch (e) {
      alert(e instanceof Error ? e.message : '저장 실패');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="w-full max-w-[420px] mx-auto pb-[calc(env(safe-area-inset-bottom)+96px)]">
      <Header value="투어일지"/>

      <Preview
        neckOverlay={neck?.overlay ?? null}
        neckFit={neck?.fit ?? null}
        lineOverlay={line?.overlay ?? null}
        lineFit={line?.fit ?? null}
        canvasRatioPct={90}
      />

      <OptionPills
        title="소재"
        options={dressMaterials}
        selected={materials}
        onToggle={toggleMaterial}
      />

      <Section title="넥라인" titleSize="md" bleed="viewport" className="mt-[10px]">
        <ThumbGrid
          items={dressNecklines}
          selectedId={neck?.id}
          onSelect={(it) => setNeck(neck?.id === it.id ? null : it)}
        />
      </Section>

      <Section title="라인" titleSize="md" bleed="viewport" className="mt-[10px]">
        <ThumbGrid
          items={dressLines}
          selectedId={line?.id}
          onSelect={(it) => setLine(line?.id === it.id ? null : it)}
        />
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[420px] px-[22px] pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 bg-white/80 backdrop-blur">
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave || saving}
          className={[
            'h-12 w-full rounded-xl text-white font-semibold',
            canSave && !saving
              ? 'bg-primary-500 hover:bg-primary-300'
              : 'bg-primary-200 text-primary-300 cursor-not-allowed',
          ].join(' ')}
        >
          {saving ? '저장 중…' : '저장하기'}
        </button>
      </div>
    </main>
  );
}