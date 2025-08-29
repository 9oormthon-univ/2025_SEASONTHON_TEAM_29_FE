'use client';

import Input from '@/components/common/atomic/Input';
import { Field } from '@/components/forms/Field';
import FieldHint from '@/components/forms/FieldHint';
import { InputWithButton } from '@/components/forms/InputWithButton';
import SmsCodeField from '@/components/forms/SmsCodeField';
import type { Basic } from '@/hooks/useSignupWizard';
import { useSignupWizard } from '@/hooks/useSignupWizard';
import { useState } from 'react';

type Props = ReturnType<typeof useSignupWizard>;

export default function StepBasic(props: Props) {
  const [nameActive, setNameActive]   = useState(false);
  const [birthActive, setBirthActive] = useState(false);
  const [resendKey, setResendKey] = useState(0);
  const {
    basic, setBasic,
    isValidPhone, sendingCode, codeRequested, verifySms, sendSms,
    flags, // { nameOk, birthOk, phoneOk }
  } = props;

  const touchedName  = basic.name.length  > 0;
  const touchedBirth = basic.birth.length > 0;
  const touchedPhone = basic.phone.length > 0;

  const setBasicField = <K extends keyof Basic>(key: K, value: Basic[K]) =>
    setBasic((s) => ({ ...s, [key]: value }));

  return (
    <section className="min-w-0 flex-[0_0_100%]">
      <div className="pt-6">
        <p className="text-sm text-text-secondary">검증된 개인정보 수집을 위해</p>
        <h2 className="mt-1 text-2xl font-extrabold">본인확인을 해주세요.</h2>

        {/* 이름 */}
        <Field label="이름" htmlFor="name" className="mt-4">
          <Input
            id="name"
            placeholder="실명을 입력해주세요."
            value={basic.name}
            onChange={(e) => setBasicField('name', e.target.value)}
            type={basic.name || nameActive ? 'variant4' : 'default'}
            onFocus={() => setNameActive(true)}
            onBlur={() => setNameActive(false)}
            onMouseEnter={() => setNameActive(true)}
            onMouseLeave={() => setNameActive(false)}
          />
          {touchedName && !flags.nameOk && (
            <FieldHint tone="error">이름은 2자 이상 입력해주세요.</FieldHint>
          )}
        </Field>

        {/* 생년월일 */}
        <Field label="생년월일" htmlFor="birth" className="mt-4">
          <Input
            id="birth"
            placeholder="YYYY / MM / DD"
            inputMode="numeric"
            value={basic.birth}
            onChange={(e) => setBasicField('birth', e.target.value)}
            type={basic.birth || birthActive ? 'variant4' : 'default'}
            onFocus={() => setBirthActive(true)}
            onBlur={() => setBirthActive(false)}
            onMouseEnter={() => setBirthActive(true)}
            onMouseLeave={() => setBirthActive(false)}
          />
          {touchedBirth && !flags.birthOk && (
            <FieldHint tone="error">YYYYMMDD 또는 YYYY/MM/DD 형식으로 입력해주세요.</FieldHint>
          )}
        </Field>

        {/* 전화번호 + 인증 버튼 */}
        <Field label="전화번호" htmlFor="phone" className="mt-4">
          <InputWithButton
            inputProps={{
              id: 'phone',
              placeholder: '전화번호를 입력해 주세요.',
              inputMode: 'tel',
              value: basic.phone,
              onChange: (e) => setBasicField('phone', e.target.value),
            }}
            buttonText={codeRequested ? (sendingCode ? '전송중…' : '재전송') : (sendingCode ? '전송중…' : '인증번호')}
            onButtonClick={sendSms}
            disabled={!isValidPhone || sendingCode}
            invalid={touchedPhone && !isValidPhone}
          />
          {touchedPhone && !isValidPhone && (
            <FieldHint tone="error">휴대전화 형식이 올바르지 않습니다. 예) 010-1234-5678</FieldHint>
          )}
          {codeRequested && !flags.phoneOk && (
            <FieldHint>문자로 받은 6자리 인증번호를 입력해 인증을 완료해주세요.</FieldHint>
          )}
        </Field>

        {codeRequested && (
          <SmsCodeField
            key={resendKey} // 또는 resendKey={resendKey}
            onVerify={verifySms}
            onExpire={() => {
              // ✅ 만료 처리
              console.log('만료됨');
            }}
            seconds={300} // ✅ 5분 (기본 180초 → 300초로 변경)
          />
        )}
      </div>
    </section>
  );
}