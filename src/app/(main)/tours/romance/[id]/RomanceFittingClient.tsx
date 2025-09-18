'use client';

import Button from '@/components/common/atomic/Button';
import Header from '@/components/common/monocules/Header';
import Section from '@/components/common/Section';
import OptionPills from '@/components/tours/fitting/OptionPills';
import Preview from '@/components/tours/fitting/Preview';
import ThumbGrid from '@/components/tours/fitting/ThumbGrid';
import { dressLines, dressMaterials, dressNecklines } from '@/data/dressOptions';
import { useDressFitting } from '@/hooks/useDressFitting';
import {
  lineIdFromOrder,
  lineOrderFromId,
  materialNameFromOrder,
  materialOrderFromName,
  neckIdFromOrder,
  neckOrderFromId,
} from '@/services/mappers/tourMappers';
import { getTourRomanceDetail } from '@/services/tourRomance.api';
import { updateRomance } from '@/services/tours.api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RomanceFittingClient({ id }: { id: string }) {
  const { materials, toggleMaterial, neck, setNeck, line, setLine, canSave } =
    useDressFitting();
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const detail = await getTourRomanceDetail(Number(id));
        if (!alive || !detail) return;

        // 소재
        const mat = materialNameFromOrder(detail.materialOrder ?? 0);
        if (mat) {
          materials.forEach((m) => {
            if (m !== mat) toggleMaterial(m);
          });
          if (!materials.includes(mat)) toggleMaterial(mat);
        }

        // 넥라인
        const neckId = neckIdFromOrder(detail.neckLineOrder ?? 0);
        if (neckId) {
          const nk =
            dressNecklines.find((n) => String(n.id) === neckId) ?? null;
          setNeck(nk);
        }

        // 라인
        const lineId = lineIdFromOrder(detail.lineOrder ?? 0);
        if (lineId) {
          const ln = dressLines.find((l) => String(l.id) === lineId) ?? null;
          setLine(ln);
        }
      } catch (e) {
        console.warn('romance detail preload failed', e);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await updateRomance(Number(id), {
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
      <Header showBack onBack={() => router.push('/tours')} value="드레스 로망" />
        <div className='px-[22px] '>

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
            const target = name;
            materials.forEach((m) => {
              if (m !== target) toggleMaterial(m);
            });
            if (!materials.includes(target)) toggleMaterial(target);
          }}
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

        <div className="mt-10">
          <Button
            onClick={onSave}
            disabled={!canSave || saving}
            ariaLabel="드레스 로망 옵션 저장"
          >
            {saving ? '저장 중…' : '저장하기'}
          </Button>
        </div>
      </div>
      </div>
    </main>
  );
}