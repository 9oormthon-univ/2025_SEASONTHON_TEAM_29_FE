'use client';

import Input from '@/components/common/atomic/Input';
import DateInput from '@/components/forms/DateInput';
import { Field } from '@/components/forms/Field';
import FieldHint from '@/components/forms/FieldHint';
import { InputWithButton } from '@/components/forms/InputWithButton';
import SmsCodeField from '@/components/forms/SmsCodeField';
import type { Basic } from '@/hooks/useSignupWizard';
import { useSignupWizard } from '@/hooks/useSignupWizard';
import { useState } from 'react';

type Props = ReturnType<typeof useSignupWizard>;

export default function StepBasic(props: Props) {
  const [nameActive, setNameActive] = useState(false);
  const [resendKey, setResendKey] = useState(0);
  const {
    basic,
    setBasic,
    isValidPhone,
    sendingCode,
    codeRequested,
    verifySms,
    sendSms,
    flags, // { nameOk, birthOk, phoneOk }
  } = props;

  const touchedName = basic.name.length > 0;
  const touchedBirth = basic.birth.length > 0;
  const touchedPhone = basic.phone.length > 0;

  const setBasicField = <K extends keyof Basic>(key: K, value: Basic[K]) =>
    setBasic((s) => ({ ...s, [key]: value }));

  return (
    <section className="min-w-0 flex-[0_0_100%]">
      <div className="pt-6">
        <p className="text-sm text-text-default font-medium">
          검증된 개인정보 수집을 위해
        </p>
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
          <DateInput
            raw={basic.birth}
            onRawChange={(raw) => setBasicField('birth', raw)}
          />
          {touchedBirth && !flags.birthOk && (
            <FieldHint tone="error">
              YYYY / MM / DD 형식의 유효한 날짜를 입력해주세요.
            </FieldHint>
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
            buttonText={
              codeRequested
                ? sendingCode
                  ? '전송중…'
                  : '재전송'
                : sendingCode
                  ? '전송중…'
                  : '인증번호'
            }
            onButtonClick={async () => {
              const wasRequested = codeRequested; // 재전송 여부 체크
              await sendSms(); // 전송(성공 시 hook에서 codeRequested true 유지/설정)
              if (wasRequested) setResendKey((k) => k + 1); // ✅ 재전송이면 입력칸/타이머 초기화
            }}
            disabled={!isValidPhone || sendingCode}
            invalid={touchedPhone && !isValidPhone}
          />
          {touchedPhone && !isValidPhone && (
            <FieldHint tone="error">
              휴대전화 형식이 올바르지 않습니다. 예) 010-1234-5678
            </FieldHint>
          )}
        </Field>

        {/* 인증번호 입력 (key가 바뀌면 초기화) */}
        {codeRequested && (
          <SmsCodeField
            key={resendKey}
            onVerify={verifySms}
            onExpire={() => {
              console.log('만료됨');
            }}
            seconds={300}
          />
        )}
      </div>
    </section>
  );
}
