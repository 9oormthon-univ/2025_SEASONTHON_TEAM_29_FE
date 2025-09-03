// src/app/(public)/(auth)/social/page.tsx
'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/common/atomic/Button';
import ProgressBar from '@/components/common/atomic/ProgressBar';
import DateInput, { isValidYMD } from '@/components/forms/DateInput';
import { Field } from '@/components/forms/Field';
import FieldHint from '@/components/forms/FieldHint';
import { InputWithButton } from '@/components/forms/InputWithButton';
import { PillRadio } from '@/components/forms/PillRadio';
import SmsCodeField from '@/components/forms/SmsCodeField';

import { socialSignup } from '@/services/auth.api';
import type { SocialSignupPayload } from '@/types/auth';

export default function SocialSignupPage() {
  const router = useRouter();

  // form state
  const [birth, setBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [wedding, setWedding] = useState('');
  const [role, setRole] = useState<'groom' | 'bride' | null>(null);

  // sms
  const [sending, setSending] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const [resendKey, setResendKey] = useState(0);
  const [okCode, setOkCode] = useState(false);

  // ui
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // validators
  const phoneDigits = phone.replace(/\D/g, '');
  const validPhone = /^010\d{8}$/.test(phoneDigits);
  const validBirth = /^(\d{4})[.\-/]?(0[1-9]|1[0-2])[.\-/]?(0[1-9]|[12]\d|3[01])$/.test(
    birth.replace(/\s/g, '')
  );
  const validWedding = isValidYMD(wedding);
  const canSubmit = validPhone && okCode && validBirth && validWedding && !!role && !loading;

  // actions
  const prev = () => {
    if (window.history.length > 1) router.back();
    else router.replace('/');
  };

  async function sendSms() {
    if (!validPhone || sending) return;
    setSending(true);
    try {
      await fetch('/api/auth/phone/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneDigits }),
      });
      setCodeRequested(true);
    } finally {
      setSending(false);
    }
  }

  async function verify(code: string) {
    const res = await fetch('/api/auth/phone/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) throw new Error('인증 실패');
    setOkCode(true);
    return true;
  }

  async function submit() {
    if (!canSubmit) return;
    setErr(null);
    setLoading(true);

    const norm = (v: string) =>
      v.trim().replace(/[^0-9]/g, '').replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');

    const payload: SocialSignupPayload = {
      birthDate: norm(birth),
      phoneNumber: phoneDigits,
      weddingDate: norm(wedding),
      type: role === 'groom' ? 'GROOM' : 'BRIDE',
    };

    try {
      const res = await socialSignup(payload);
      if (res.success) router.replace('/home');
      else setErr(res.message ?? '가입에 실패했어요.');
    } catch (e) {
      setErr(e instanceof Error ? e.message : '가입에 실패했어요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto h-dvh w-full max-w-[420px] overflow-hidden pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <div className="flex min-h-dvh flex-col">
        {/* Header (원본 레이아웃과 동일) */}
        <header className="sticky top-0 z-10 bg-white/70 backdrop-blur px-4">
          <div className="relative mx-auto flex h-16 max-w-[420px] items-center justify-center">
            <button
              aria-label="back"
              onClick={prev}
              className="absolute left-0 disabled:opacity-40"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <h1 className="text-md font-medium">회원가입</h1>
          </div>
          {/* 단일 스텝이지만 진행바 모양 유지 */}
          <ProgressBar value={1} max={1} size="xs" className="w-full" />
        </header>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          <div className="px-4 pb-4 space-y-4 mx-auto max-w-[420px] overflow-auto">
            <p className="pt-6 text-sm text-text-secondary">이제 다 끝났어요!</p>
            <h2 className="mt-1 text-2xl font-extrabold">추가정보를 입력해주세요.</h2>

            {/* 생년월일 */}
            <Field label="생년월일" htmlFor="birth" className="mt-4">
              <DateInput raw={birth} onRawChange={setBirth} />
              {!!birth && !validBirth && <FieldHint tone="error">YYYY / MM / DD 형식의 유효한 날짜를 입력해주세요.</FieldHint>}
            </Field>

            {/* 전화번호 + 인증 버튼 */}
            <Field label="전화번호" htmlFor="phone" className="mt-4">
              <InputWithButton
                inputProps={{
                  id: 'phone',
                  inputMode: 'tel',
                  placeholder: '전화번호를 입력해 주세요.',
                  value: phone,
                  onChange: (e) => setPhone(e.target.value),
                }}
                buttonText={
                  codeRequested ? (sending ? '전송중…' : '재전송') : (sending ? '전송중…' : '인증번호')
                }
                onButtonClick={async () => {
                  const was = codeRequested;
                  await sendSms();
                  if (was) setResendKey((k) => k + 1);
                }}
                disabled={!validPhone || sending}
                invalid={!!phone && !validPhone}
              />
            </Field>

            {/* 인증번호 입력 */}
            {codeRequested && (
              <SmsCodeField key={resendKey} onVerify={verify} seconds={300} />
            )}

            {/* 결혼예정일 */}
            <Field label="결혼예정일" htmlFor="wedding" className="mt-4">
              <DateInput raw={wedding} onRawChange={setWedding} />
              {!!wedding && !validWedding && <FieldHint tone="error">YYYY / MM / DD 형식의 유효한 날짜를 입력해주세요.</FieldHint>}
            </Field>

            {/* 역할 선택 */}
            <Field label="부부 형태" className="mt-4">
              <PillRadio
                options={[
                  { value: 'groom', label: '신랑' },
                  { value: 'bride', label: '신부' },
                ]}
                value={role}
                onChange={(v) => setRole(v as 'groom' | 'bride')}
              />
              {!role && <FieldHint>역할을 선택해주세요.</FieldHint>}
            </Field>

            {err && <p className="text-sm text-rose-500">{err}</p>}
          </div>
        </div>

        {/* Footer (원본 레이아웃과 동일) */}
        <div className="sticky bottom-0 px-4 bg-white/70 pb-[calc(env(safe-area-inset-bottom))] pt-3 backdrop-blur">
          <Button
            size="md"
            fullWidth
            disabled={!canSubmit}
            onClick={submit}
            className="h-12 text-sm"
          >
            {loading ? '가입 중…' : '웨딧 시작하기'}
          </Button>
        </div>
      </div>
    </main>
  );
}