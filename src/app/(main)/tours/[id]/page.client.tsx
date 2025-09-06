// src/app/(main)/tours/[id]/DressFittingClient.tsx
'use client';

import Button from '@/components/common/atomic/Button';
import Header from '@/components/common/monocules/Header';
import Section from '@/components/common/Section';
import OptionPills from '@/components/tours/fitting/OptionPills';
import Preview from '@/components/tours/fitting/Preview';
import ThumbGrid from '@/components/tours/fitting/ThumbGrid';
import {
  dressLines,
  dressMaterials,
  dressNecklines,
} from '@/data/dressOptions';
import { useDressFitting } from '@/hooks/useDressFitting';
import {
  lineIdFromOrder,
  lineOrderFromId,
  materialNameFromOrder,
  materialOrderFromName,
  neckIdFromOrder,
  neckOrderFromId,
} from '@/services/mappers/tourMappers';
import { getTourDetail, saveDress } from '@/services/tours.api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DressFittingClient({ id }: { id: string }) {
  const { materials, toggleMaterial, neck, setNeck, line, setLine, canSave } =
    useDressFitting();
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // 상세값으로 초기 세팅
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getTourDetail(Number(id));
        const d = res.data;
        if (!alive || !d) return;

        const { materialOrder, neckLineOrder, lineOrder } = d;

        // ── 소재(단일): 현재 ON 전부 끄고, target 하나만 ON
        const targetMaterial = materialNameFromOrder(materialOrder);
        if (targetMaterial) {
          // 끄기
          materials.forEach((m) => {
            if (m !== targetMaterial) toggleMaterial(m); // ON이면 OFF
          });
          // 켜기
          if (!materials.includes(targetMaterial))
            toggleMaterial(targetMaterial);
        }

        // ── 넥라인
        const targetNeckId = neckIdFromOrder(neckLineOrder);
        if (targetNeckId) {
          const nk =
            dressNecklines.find((n) => String(n.id) === targetNeckId) ?? null;
          setNeck(nk);
        }

        // ── 라인
        const targetLineId = lineIdFromOrder(lineOrder);
        if (targetLineId) {
          const ln =
            dressLines.find((l) => String(l.id) === targetLineId) ?? null;
          setLine(ln);
        }
      } catch (e) {
        console.warn('tour detail preload failed', e);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const _onSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await saveDress({
        tourId: Number(id),
        materialOrder: materialOrderFromName(materials[0] ?? null),
        neckLineOrder: neckOrderFromId(neck?.id),
        lineOrder: lineOrderFromId(line?.id),
      });
      router.replace('/tours');
    } catch (e) {
      alert(e instanceof Error ? e.message : '저장 실패');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="w-full max-w-[420px] mx-auto pb-[calc(env(safe-area-inset-bottom)+96px)]">
      <Header
        value="투어일지"
        className="h-[50px]"
        showBack
        onBack={() => router.back()}
      />

      <Preview
        neckOverlay={neck?.overlay ?? null}
        neckFit={neck?.fit ?? null}
        lineOverlay={line?.overlay ?? null}
        lineFit={line?.fit ?? null}
        canvasRatioPct={90}
      />
      <div className="pt-4">
        <OptionPills
          title="소재"
          options={dressMaterials}
          selected={materials}
          onToggle={(name) => {
            // 단일 선택 UX로 강제: 선택된 항목만 남기기
            const target = name;
            materials.forEach((m) => {
              if (m !== target) toggleMaterial(m); // 끄기
            });
            if (!materials.includes(target)) toggleMaterial(target); // 켜기
          }}
        />

        <Section
          title="넥라인"
          titleSize="md"
          bleed="viewport"
          className="mt-[10px]"
        >
          <ThumbGrid
            items={dressNecklines}
            selectedId={neck?.id}
            onSelect={(it) => setNeck(neck?.id === it.id ? null : it)}
          />
        </Section>

        <Section
          title="라인"
          titleSize="md"
          bleed="viewport"
          className="mt-[10px]"
        >
          <ThumbGrid
            items={dressLines}
            selectedId={line?.id}
            onSelect={(it) => setLine(line?.id === it.id ? null : it)}
          />
        </Section>

        <div className="mt-10 mx-5.5">
          <Button> {saving ? '저장 중…' : '저장하기'}</Button>
        </div>
      </div>
    </main>
  );
}
