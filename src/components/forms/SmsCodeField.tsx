'use client';

import { cn } from '@/utills/cn';
import Input from '@/components/common/atomic/Input';
import InputBadge from '@/components/common/atomic/InputBadge';
import { useEffect, useMemo, useState } from 'react';
import type { InputVisualType } from '@/components/common/atomic/Input';

function mmss(t: number) {
  const m = Math.floor(t / 60)
    .toString()
    .padStart(2, '0');
  const s = (t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

type Props = {
  onVerify: (code: string) => Promise<boolean>;
  onExpire?: () => void;
  onVerified?: (ok: boolean) => void;
  seconds?: number;
  resendKey?: number | string;
  disabled?: boolean;
  className?: string;
};

export default function SmsCodeField({
  onVerify,
  onExpire,
  onVerified,
  seconds = 300,
  resendKey,
  disabled,
  className,
}: Props) {
  const [code, setCode] = useState('');
  const [left, setLeft] = useState(seconds);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setCode('');
    setLeft(seconds);
    setVerified(false);
    setError(null);
  }, [resendKey, seconds]);

  useEffect(() => {
    if (verified) return;
    if (left <= 0) {
      onExpire?.();
      return;
    }
    const id = setInterval(() => setLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [left, verified, onExpire]);

  const codeLen = code.trim().length;
  const canVerify = useMemo(
    () => codeLen === 6 && left > 0 && !verifying && !verified && !disabled,
    [codeLen, left, verifying, verified, disabled],
  );
  const showVerifyBtn = codeLen === 6 && !verified;

  async function handleVerify() {
    if (!canVerify) return;
    try {
      setVerifying(true);
      setError(null);
      const ok = await onVerify(code.trim());
      setVerified(ok);
      onVerified?.(ok);
      if (!ok) setError('인증번호가 올바르지 않습니다.');
    } catch {
      setError('인증 중 오류가 발생했어요. 다시 시도해주세요.');
      onVerified?.(false);
    } finally {
      setVerifying(false);
    }
  }

  const hasValue = code !== '';
  const uiType: InputVisualType = error
    ? 'incorrect'
    : focused || hasValue
      ? 'variant4'
      : 'default';
  return (
    <div className={cn('mt-3', className)}>
      <label
        htmlFor="smsCode"
        className="block text-sm font-medium text-gray-900"
      >
        인증번호
      </label>

      <div className="relative mt-2 w-full">
        <Input
          id="smsCode"
          inputType="text"
          inputMode="numeric"
          maxLength={6}
          disabled={disabled || verified}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="숫자 6자리를 입력하세요."
          aria-invalid={!!error || undefined}
          type={uiType as any}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          fullWidth
          className={cn('pr-[112px]')}
        />
        {!verified && !showVerifyBtn && (
          <div
            className={cn(
              'pointer-events-none absolute right-4 top-1/2 -translate-y-1/2',
              'rounded-lg px-3 py-1.5 text-sm',
              left > 10
                ? 'text-primary-500'
                : left > 0
                  ? 'text-yellow-700'
                  : 'text-red-600',
            )}
            aria-live="polite"
          >
            {mmss(Math.max(left, 0))}
          </div>
        )}
        {!verified && showVerifyBtn && (
          <InputBadge
            type="button"
            onClick={canVerify ? handleVerify : undefined}
            disabled={!canVerify}
            variant={!canVerify ? 'ghost' : 'primary'}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-8 px-2"
          >
            {verifying ? '인증중…' : '인증'}
          </InputBadge>
        )}

        {verified && (
          <InputBadge
            type="button"
            disabled
            variant="secondary"
            aria-live="polite"
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2',
              'w-auto h-8 px-3 py-1.5 text-sm',
            )}
          >
            인증완료
          </InputBadge>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
