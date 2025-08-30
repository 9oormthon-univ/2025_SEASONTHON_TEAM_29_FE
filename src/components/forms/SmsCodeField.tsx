'use client';

import { cn } from '@/utills/cn';
import { useEffect, useMemo, useState } from 'react';

function mmss(t: number) {
  const m = Math.floor(t / 60).toString().padStart(2, '0');
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

  useEffect(() => {
    setCode('');
    setLeft(seconds);
    setVerified(false);
    setError(null);
  }, [resendKey, seconds]);

  useEffect(() => {
    if (verified) return;
    if (left <= 0) { onExpire?.(); return; }
    const id = setInterval(() => setLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [left, verified, onExpire]);

  const codeLen = code.trim().length;
  const canVerify = useMemo(
    () => codeLen === 6 && left > 0 && !verifying && !verified && !disabled,
    [codeLen, left, verifying, verified, disabled]
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

  return (
    <div className={cn('mt-3', className)}>
      <label htmlFor="smsCode" className="block text-sm font-medium text-gray-900">인증번호</label>

      <div className="relative mt-2 w-full">
        <input
          id="smsCode"
          inputMode="numeric"
          maxLength={6}
          disabled={disabled || verified}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="숫자 6자리를 입력하세요."
          aria-invalid={!!error}
          className={cn(
            'w-full rounded-xl border px-4 py-3 pr-24 outline-none transition',
            'placeholder:text-gray-400 focus:border-primary-500',
            error ? 'border-red-400' : (code ? 'border-black' : 'border-gray-300'),
            (disabled || verified) && 'bg-gray-50 text-gray-400 cursor-not-allowed'
          )}
        />

        {!verified && !showVerifyBtn && (
          <div
            className={cn(
              'pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm',
              left > 10 ? 'text-primary-500' : 'text-yellow-700',
              left <= 0 && 'text-red-600'
            )}
            aria-live="polite"
          >
            {mmss(Math.max(left, 0))}
          </div>
        )}

        {!verified && showVerifyBtn && (
          <button
            type="button"
            onClick={handleVerify}
            disabled={!canVerify}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm transition',
              canVerify ? 'bg-primary-500 text-white' : 'bg-primary-500/10 text-primary-500/40 cursor-not-allowed'
            )}
          >
            {verifying ? '인증중…' : '인증'}
          </button>
        )}

        {verified && (
          <div
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm transition',
              'bg-primary-500/10 text-primary-500/40 cursor-not-allowed'
            )}
            aria-live="polite"
          >
            인증완료
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}