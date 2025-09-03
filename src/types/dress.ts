// src/types/dress.ts
export type DressMaterial = string; // 간단히 문자열
export type FitAdjust = {
  scale?: number;              // 1 = 원본
  offset?: { x?: number; y?: number }; // % 단위 (캔버스 기준)
  origin?: string;             // CSS transform-origin, 기본 '50% 50%'
};

export type DressNeckline = {
  id: string;
  name: string;
  thumb: string;
  overlay: string;
  fit?: FitAdjust;             // ← 각 자산별 보정
};

export type DressLine = {
  id: string;
  name: string;
  thumb: string;
  overlay: string;
  fit?: FitAdjust;             // ← 각 자산별 보정
};