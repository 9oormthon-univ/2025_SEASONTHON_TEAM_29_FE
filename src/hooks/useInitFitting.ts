'use client';

import { useEffect, useRef } from 'react';
import { dressLines, dressNecklines } from '@/data/dressOptions';
import {
  lineIdFromOrder,
  materialNameFromOrder,
  neckIdFromOrder,
} from '@/services/mappers/tourMappers';
import { useDressFitting } from './useDressFitting';

type FittingData = {
  materialOrder: number;
  neckLineOrder: number;
  lineOrder: number;
};

export function useInitFitting(
  data: FittingData | null | undefined,
  depsKey?: unknown, // 외부에서 재실행이 필요하면 키 하나만 넘겨주세요
) {
  const { materials, toggleMaterial, neck, setNeck, line, setLine } =
    useDressFitting();

  // 같은 입력으로 재실행 방지
  const appliedSigRef = useRef<string | null>(null);

  useEffect(() => {
    if (!data) return;

    const sig = `${data.materialOrder}-${data.neckLineOrder}-${data.lineOrder}`;
    if (appliedSigRef.current === sig) return;

    const mat = materialNameFromOrder(data.materialOrder);
    if (mat) {
      materials.forEach((m) => {
        if (m !== mat) toggleMaterial(m);
      });
      if (!materials.includes(mat)) toggleMaterial(mat);
    }

    const neckId = neckIdFromOrder(data.neckLineOrder);
    if (neckId) {
      const nk = dressNecklines.find((n) => String(n.id) === neckId) ?? null;
      setNeck(nk);
    }

    const lineId = lineIdFromOrder(data.lineOrder);
    if (lineId) {
      const ln = dressLines.find((l) => String(l.id) === lineId) ?? null;
      setLine(ln);
    }

    appliedSigRef.current = sig;
  }, [data, materials, toggleMaterial, setNeck, setLine, depsKey]);

  return { materials, toggleMaterial, neck, setNeck, line, setLine };
}
