'use client';

import type { DressLine, DressNeckline } from '@/types/dress';
import { useMemo, useState } from 'react';

export function useDressFitting() {
  const [materials, setMaterials] = useState<string[]>([]);
  const [neck, setNeck] = useState<DressNeckline | null>(null);
  const [line, setLine] = useState<DressLine | null>(null);

  const toggleMaterial = (m: string) =>
    setMaterials((prev) => (prev.includes(m) ? prev.filter(v => v !== m) : [...prev, m]));

  const canSave = useMemo(() => !!neck && !!line, [neck, line]);

  return { materials, toggleMaterial, neck, setNeck, line, setLine, canSave };
}