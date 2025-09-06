// src/components/auth/signup/steps/StepTerms.tsx
'use client';

import { CheckboxRow } from '@/components/forms/CheckboxRow';
import type { SignupWizardCtx } from '@/types/auth'; // 기존 경로에 맞춰주세요

type Props = SignupWizardCtx;

export default function StepTerms({ terms, setTerms, toggleAllTerms }: Props) {
  return (
    <section className="min-w-0 flex-[0_0_100%]">
      <div className="pt-6">
        <p className="text-sm text-text-default">웨딧의 원활한 이용을 위해</p>
        <h2 className="mt-1 text-2xl font-extrabold">약관에 동의해주세요.</h2>

        <div className="mt-6 rounded-md border border-gray-200 px-4 pt-3">
          {/* 전체 약관 동의 (굵게, 화살표 없음, 보라색 꽉 원형) */}
          <CheckboxRow
            label="전체 약관 동의"
            checked={terms.all}
            onChange={toggleAllTerms}
            strong
            showArrow={false}
          />

          <div className="my-2 h-px bg-gray-200" />

          {/* (필수) 항목들 – 일반 스타일, 화살표 표시 */}
          {(
            [
              ['(필수) 어플명 회원 이용약관', 't1'],
              ['(필수) 위치기반 서비스 이용약관', 't2'],
              ['(필수) 개인정보 수집/이용', 't3'],
              ['(필수) 개인신용정보 수집/이용동의', 't4'],
              ['(필수) 개인신용정보 제공 동의', 't5'],
            ] as const
          ).map(([label, key]) => (
            <CheckboxRow
              key={key}
              label={label}
              checked={terms[key]}
              strong
              onChange={(v) =>
                setTerms((s) => ({ ...s, [key]: v, all: false }))
              }
              showArrow
            />
          ))}

          <div className="my-3 h-px bg-gray-200" />
          <div className="mb-3">
            {/* (선택) 항목들 – 연한(무채) 스타일, 화살표 없음 */}
            {(
              [
                ['(선택) 마케팅 목적 개인정보 수집/이용', 'mkt'],
                ['(선택) 개인정보 제3자 제공', 'third'],
              ] as const
            ).map(([label, key]) => (
              <CheckboxRow
                key={key}
                label={label}
                checked={Boolean(terms[key])}
                muted
                onChange={(v) =>
                  setTerms((s) => ({ ...s, [key]: v, all: false }))
                }
                showArrow={false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
