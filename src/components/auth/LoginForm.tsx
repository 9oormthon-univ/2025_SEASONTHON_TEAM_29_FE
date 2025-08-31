// src/components/auth/LoginForm.tsx
'use client';

import Button from '@/components/common/atomic/Button';
import Input from '@/components/common/atomic/Input';
import * as api from '@/services/auth.api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { SocialCircle } from '../common/atomic/SocialCircle';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPw, setFocusPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = isValidEmail && pw.length >= 1 && !loading;

  const onSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setLoading(true);
    setErr(null);
    try {
      await api.login({ email: email.trim(), password: pw });
      router.replace('/home');
    } catch (e: any) {
      setErr(e?.message || '로그인에 실패했어요. 이메일/비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }, [canSubmit, email, pw, router]);

  // 간단 소셜 시작 (백엔드 라우트에 맞게 수정)
  const startOAuth = (provider: 'kakao' | 'naver' | 'google') => {
    // 예: /api/oauth/{provider}로 리다이렉트 프록시 (rewrites 사용)
    window.location.href = `/api/oauth/${provider}`;
  };

  return (
    <div className="pt-30">
      {/* 로고 & 카피 */}
      <div className="flex flex-col items-center">
        <Image
          src="/icons/logoPrimary.svg"
          alt="웨딧"
          width={120}
          height={60}
          className={`h-12 w-auto`}
          aria-hidden
        />
        <p className="mt-4 text-center text-[15px] text-black font-semibold">
          결혼 준비를 내 마음대로, 편집하다
        </p>
      </div>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Input
          inputType="email"
          autoComplete="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type={focusEmail || !!email ? 'variant4' : 'default'}
          onFocus={() => setFocusEmail(true)}
          onBlur={() => setFocusEmail(false)}
          onMouseEnter={() => setFocusEmail(true)}
          onMouseLeave={() => setFocusEmail(false)}
        />

        <Input
          inputType="password"
          autoComplete="current-password"
          placeholder="비밀번호 입력"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          type={focusPw || !!pw ? 'variant4' : 'default'}
          onFocus={() => setFocusPw(true)}
          onBlur={() => setFocusPw(false)}
          onMouseEnter={() => setFocusPw(true)}
          onMouseLeave={() => setFocusPw(false)}
        />

        <Button
          type="submit"
          fullWidth
          size="md"
          disabled={!canSubmit}
          className="max-w-[346px] text-[15px] font-extrabold shadow-sm disabled:opacity-40"
        >
          {loading ? '로그인 중…' : '로그인'}
        </Button>

        {err && <p className="text-center text-sm text-red-500">{err}</p>}

        {/* 부가 링크 */}
        <div className="text-center text-xs text-black">
          <button type="button" className="px-2 hover:underline" onClick={() => router.push('/auth/find-id')}>
            아이디 찾기
          </button>
          <span className="text-black">|</span>
          <button type="button" className="px-2 hover:underline" onClick={() => router.push('/auth/reset-password')}>
            비밀번호 찾기
          </button>
        </div>
      </form>

      {/* 구분선 */}
      <div className="mt-15 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">SNS 계정으로 로그인</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-5">
        <SocialCircle src="/icons/Social/kakao.svg"  alt="카카오 로그인" onClick={() => startOAuth('kakao')} />
        <SocialCircle src="/icons/Social/naver.svg"  alt="네이버 로그인" onClick={() => startOAuth('naver')} />
        <SocialCircle src="/icons/Social/google.svg" alt="구글 로그인"  onClick={() => startOAuth('google')} />
      </div>
    </div>
  );
}