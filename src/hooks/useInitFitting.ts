'use client';

import { dressLines, dressNecklines } from '@/data/dressOptions';
import {
  lineIdFromOrder,
  materialNameFromOrder,
  neckIdFromOrder,
} from '@/services/mappers/tourMappers';
import { useEffect } from 'react';
import { useDressFitting } from './useDressFitting';

type FittingData = {
  materialOrder: number;
  neckLineOrder: number;
  lineOrder: number;
};

export function useInitFitting(
  data: FittingData | null | undefined,
  deps: unknown[] = []
) {
  const { materials, toggleMaterial, neck, setNeck, line, setLine } =
    useDressFitting();

  useEffect(() => {
    if (!data) return;

    // 소재
    const mat = materialNameFromOrder(data.materialOrder);
    if (mat) {
      materials.forEach((m) => {
        if (m !== mat) toggleMaterial(m);
      });
      if (!materials.includes(mat)) toggleMaterial(mat);
    }

    // 넥라인
    const neckId = neckIdFromOrder(data.neckLineOrder);
    if (neckId) {
      const nk = dressNecklines.find((n) => String(n.id) === neckId) ?? null;
      setNeck(nk);
    }

    // 라인
    const lineId = lineIdFromOrder(data.lineOrder);
    if (lineId) {
      const ln = dressLines.find((l) => String(l.id) === lineId) ?? null;
      setLine(ln);
    }
  }, [data, ...deps]);

  return { materials, toggleMaterial, neck, setNeck, line, setLine };
}