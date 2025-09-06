// src/components/auth/signup/steps/StepExtra.tsx
'use client';

import Input from '@/components/common/atomic/Input';
import DateInput, { isValidYMD } from '@/components/forms/DateInput';
import { Field } from '@/components/forms/Field';
import FieldHint from '@/components/forms/FieldHint';
import { PillRadio } from '@/components/forms/PillRadio';
import type { Extra } from '@/hooks/useSignupWizard';
import { SignupWizardCtx } from '@/types/auth';
import { useState } from 'react';

type Props = SignupWizardCtx;

export default function StepExtra(props: Props) {
  // ⬇️ 이메일 전송/인증은 제거. 형식(validEmail)만 사용.
  const { extra, setExtra, isValidEmail, flags } = props;

  const setExtraField = <K extends keyof Extra>(key: K, value: Extra[K]) =>
    setExtra((s) => ({ ...s, [key]: value }));

  // hover/focus 스타일용
  const [emailActive, setEmailActive] = useState(false);
  const [pwActive, setPwActive] = useState(false);
  const [pw2Active, setPw2Active] = useState(false);

  const touchedEmail = extra.email.length > 0;
  const touchedPw = extra.pw.length > 0;
  const touchedPw2 = extra.pw2.length > 0;
  const touchedWedding = extra.wedding.length > 0;
  const weddingOk = isValidYMD(extra.wedding);

  return (
    <section className="min-w-0 flex-[0_0_100%]">
      <div className="pt-6">
        <p className="text-sm text-text-default font-medium">
          이제 다 끝났어요!
        </p>
        <h2 className="mt-1 text-2xl font-extrabold">
          추가정보를 입력해주세요.
        </h2>

        {/* 이메일 (전송 버튼/인증 제거, 형식만 검증) */}
        <Field label="이메일" htmlFor="email" className="mt-4">
          <Input
            id="email"
            inputType="email"
            placeholder="examples33@gmail.com"
            value={extra.email}
            onChange={(e) => setExtraField('email', e.target.value)} // ✅ 버그 수정
            type={emailActive || !!extra.email ? 'variant4' : 'default'}
            onFocus={() => setEmailActive(true)}
            onBlur={() => setEmailActive(false)}
            onMouseEnter={() => setEmailActive(true)}
            onMouseLeave={() => setEmailActive(false)}
          />
          {touchedEmail && !isValidEmail && (
            <FieldHint tone="error">이메일 형식이 올바르지 않습니다.</FieldHint>
          )}
        </Field>

        {/* 비밀번호 */}
        <Field label="비밀번호" htmlFor="pw" className="mt-4">
          <Input
            id="pw"
            inputType="password"
            placeholder="비밀번호를 설정해주세요."
            value={extra.pw}
            onChange={(e) => setExtraField('pw', e.target.value)}
            type={pwActive || !!extra.pw ? 'variant4' : 'default'}
            onFocus={() => setPwActive(true)}
            onBlur={() => setPwActive(false)}
            onMouseEnter={() => setPwActive(true)}
            onMouseLeave={() => setPwActive(false)}
          />
          {touchedPw && !flags.pwOk && (
            <FieldHint>
              8자 이상/ 영문, 숫자, 특수문자 중 2가지 이상을 조합해주세요.
            </FieldHint>
          )}
        </Field>

        {/* 비밀번호 확인 */}
        <Field label="비밀번호 확인" htmlFor="pw2" className="mt-4">
          <Input
            id="pw2"
            inputType="password"
            placeholder="비밀번호를 재입력해주세요."
            value={extra.pw2}
            onChange={(e) => setExtraField('pw2', e.target.value)}
            type={pw2Active || !!extra.pw2 ? 'variant4' : 'default'}
            onFocus={() => setPw2Active(true)}
            onBlur={() => setPw2Active(false)}
            onMouseEnter={() => setPw2Active(true)}
            onMouseLeave={() => setPw2Active(false)}
          />
          {touchedPw2 && !flags.pw2Ok && (
            <FieldHint tone="error">비밀번호가 일치하지 않습니다.</FieldHint>
          )}
        </Field>

        {/* 결혼예정일 */}
        <Field label="결혼예정일" htmlFor="wedding" className="mt-4">
          <DateInput
            raw={extra.wedding}
            onRawChange={(raw) => setExtraField('wedding', raw)}
          />
          {touchedWedding && !weddingOk && (
            <FieldHint tone="error">
              YYYY / MM / DD 형식의 유효한 날짜를 입력해주세요.
            </FieldHint>
          )}
        </Field>

        {/* 역할 선택 */}
        <Field label="부부 형태" className="mt-4">
          <PillRadio
            options={[
              { value: 'bride', label: '신부' },
              { value: 'groom', label: '신랑' },
            ]}
            value={extra.role}
            onChange={(v) => setExtraField('role', v as 'groom' | 'bride')}
          />
          {!flags.roleOk && <FieldHint>역할을 선택해주세요.</FieldHint>}
        </Field>
      </div>
    </section>
  );
}
