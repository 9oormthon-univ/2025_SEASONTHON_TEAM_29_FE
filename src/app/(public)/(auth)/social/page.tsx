'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/components/common/atomic/Button';
import ProgressBar from '@/components/common/atomic/ProgressBar';
import DateInput, { isValidYMD } from '@/components/forms/DateInput';
import { Field } from '@/components/forms/Field';
import FieldHint from '@/components/forms/FieldHint';
import { InputWithButton } from '@/components/forms/InputWithButton';
import { PillRadio } from '@/components/forms/PillRadio';
import SmsCodeField from '@/components/forms/SmsCodeField';

import Header from '@/components/common/monocules/Header';
import * as api from '@/services/auth.api';
import type { SocialSignupPayload } from '@/types/auth';

const MAX_SMS_PER_DAY = 5;

export default function SocialSignupPage() {
  const router = useRouter();

  // form state
  const [birth, setBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [wedding, setWedding] = useState('');
  const [role, setRole] = useState<'groom' | 'bride' | null>(null);

  // sms
  const [sendingCode, setSendingCode] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const [resendKey, setResendKey] = useState(0);
  const [codeVerified, setCodeVerified] = useState(false);
  const [smsCount, setSmsCount] = useState(0);

  // ui
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // validators
  const phoneDigits = phone.replace(/\D/g, '');
  const isValidPhone = /^010\d{8}$/.test(phoneDigits);
  const isValidBirth =
    /^(\d{4})[.\-/]?(0[1-9]|1[0-2])[.\-/]?(0[1-9]|[12]\d|3[01])$/.test(
      birth.replace(/\s/g, ''),
    );
  const isValidWedding = isValidYMD(wedding);

  const smsRemaining = Math.max(0, MAX_SMS_PER_DAY - smsCount);
  const canSubmit =
    isValidPhone &&
    codeVerified &&
    isValidBirth &&
    isValidWedding &&
    !!role &&
    !loading;

  // utils
  function getTodayCount() {
    if (typeof window === 'undefined') return 0;
    const today = new Date().toDateString();
    const storedDay = localStorage.getItem('smsDay');
    let todayCount = Number(localStorage.getItem('smsCount') || '0');

    if (storedDay !== today) {
      todayCount = 0;
      localStorage.setItem('smsDay', today);
      localStorage.setItem('smsCount', '0');
    }
    return todayCount;
  }

  function canSendSms(): { ok: boolean; reason?: string } {
    if (typeof window === 'undefined') {
      return { ok: false, reason: '클라이언트 환경에서만 가능합니다.' };
    }
    if (smsCount >= MAX_SMS_PER_DAY) {
      return { ok: false, reason: '오늘은 더 이상 인증번호를 보낼 수 없습니다.' };
    }
    return { ok: true };
  }

  // actions
  const prev = () => {
    if (window.history.length > 1) router.back();
    else router.replace('/');
  };

  async function sendSms() {
    if (!isValidPhone || sendingCode) return;
    if (!canSendSms().ok) return;
    setSendingCode(true);
    try {
      await api.sendSms(phoneDigits);
      setCodeRequested(true);
      setCodeVerified(false);

      if (typeof window !== 'undefined') {
        const today = new Date().toDateString();
        const prevDay = localStorage.getItem('smsDay');
        let todayCount = Number(localStorage.getItem('smsCount') || '0');

        if (today !== prevDay) {
          todayCount = 0;
          localStorage.setItem('smsDay', today);
        }

        todayCount += 1;
        localStorage.setItem('smsCount', String(todayCount));
        setSmsCount(todayCount);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : '인증번호 전송 실패');
    } finally {
      setSendingCode(false);
    }
  }

  async function verifySms(code: string) {
    try {
      await api.verifySms(phoneDigits, code);
      setCodeVerified(true);
      return true;
    } catch (e) {
      setErr(e instanceof Error ? e.message : '인증 실패');
      setCodeVerified(false);
      return false;
    }
  }

  async function submit() {
    if (!canSubmit) return;
    setErr(null);
    setLoading(true);

    const norm = (v: string) =>
      v
        .trim()
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');

    const payload: SocialSignupPayload = {
      birthDate: norm(birth),
      phoneNumber: phoneDigits,
      weddingDate: norm(wedding),
      type: role === 'groom' ? 'GROOM' : 'BRIDE',
    };

    try {
      const res = await api.socialSignup(payload);
      if (res.success) router.replace('/home');
      else setErr(res.message ?? '가입에 실패했어요.');
    } catch (e) {
      setErr(e instanceof Error ? e.message : '가입에 실패했어요.');
    } finally {
      setLoading(false);
    }
  }

  // ✅ mount 시 localStorage에서 횟수 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSmsCount(getTodayCount());
    }
  }, []);

  return (
    <main className="flex min-h-dvh flex-col">
      <Header
        value="회원가입"
        showBack
        onBack={prev}
        bgClassName="bg-white/70"
        textClassName="text-text--default"
      >
        <ProgressBar value={1} max={1} size="xs" className="w-full" />
      </Header>

      <div className="flex-1 overflow-hidden mx-5.5">
        <div className="pt-6">
          <p className="text-sm text-text-default font-medium">이제 다 끝났어요!</p>
          <h2 className="mt-1 text-2xl font-extrabold">추가정보를 입력해주세요.</h2>

          {/* 생년월일 */}
          <Field label="생년월일" htmlFor="birth" className="mt-4">
            <DateInput raw={birth} onRawChange={setBirth} />
            {!!birth && !isValidBirth && (
              <FieldHint tone="error">YYYY / MM / DD 형식의 유효한 날짜를 입력해주세요.</FieldHint>
            )}
          </Field>

          {/* 전화번호 */}
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
                sendingCode
                  ? '전송중…'
                  : canSendSms().ok
                  ? codeRequested ? '재전송' : '인증번호'
                  : '오늘 횟수 초과'
              }
              onButtonClick={async () => {
                const was = codeRequested;
                await sendSms();
                if (was) setResendKey((k) => k + 1);
              }}
              disabled={!isValidPhone || sendingCode || !canSendSms().ok}
              invalid={!!phone && !isValidPhone}
            />
            <div className="mt-1 text-xs text-text-secondary">
              오늘 남은 인증 횟수: {smsRemaining}회
            </div>
          </Field>

          {codeRequested && (
            <SmsCodeField key={resendKey} onVerify={verifySms} seconds={300} />
          )}

          {/* 결혼예정일 */}
          <Field label="결혼예정일" htmlFor="wedding" className="mt-4">
            <DateInput raw={wedding} onRawChange={setWedding} />
            {!!wedding && !isValidWedding && (
              <FieldHint tone="error">YYYY / MM / DD 형식의 유효한 날짜를 입력해주세요.</FieldHint>
            )}
          </Field>

          {/* 역할 */}
          <Field label="부부 형태" className="mt-4">
            <PillRadio
              options={[
                { value: 'bride', label: '신부' },
                { value: 'groom', label: '신랑' },
              ]}
              value={role}
              onChange={(v) => setRole(v as 'groom' | 'bride')}
            />
          </Field>

          {err && <p className="text-sm text-rose-500">{err}</p>}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white/70 px-4 pb-[calc(env(safe-area-inset-bottom))] pt-3 mb-20 backdrop-blur">
        <Button
          size="md"
          fullWidth
          disabled={!canSubmit}
          onClick={submit}
          className="h-13 text-sm"
        >
          {loading ? '가입 중…' : '웨딧 시작하기'}
        </Button>
      </div>
    </main>
  );
}