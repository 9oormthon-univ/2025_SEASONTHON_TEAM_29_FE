'use client';

import { isValidYMD } from '@/components/forms/DateInput';
import * as api from '@/services/auth.api';
import { SignupWizardCtx } from '@/types/auth';
import { useEffect, useState } from 'react';

export type Basic = { name: string; birth: string; phone: string };
export type Terms = {
  all: boolean; t1: boolean; t2: boolean; t3: boolean; t4: boolean; t5: boolean;
  mkt?: boolean; third?: boolean;
};
export type Extra = {
  email: string; pw: string; pw2: string;
  role: 'groom' | 'bride' | null;
  wedding: string;
};

const MAX_SMS_PER_DAY = 5;

export function useSignupWizard(): SignupWizardCtx & {
  smsRemaining: number;
  canSendSms: () => { ok: boolean; reason?: string };
} {
  const [basic, setBasic] = useState<Basic>({ name: '', birth: '', phone: '' });
  const [terms, setTerms] = useState<Terms>({
    all: false, t1: false, t2: false, t3: false, t4: false, t5: false,
    mkt: false, third: false
  });
  const [extra, setExtra] = useState<Extra>({
    email: '', pw: '', pw2: '', role: null, wedding: ''
  });

  const [sendingCode, setSendingCode] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [smsCount, setSmsCount] = useState(0);

  const phoneDigits = basic.phone.replace(/\D/g, '');
  const isValidPhone = /^010\d{8}$/.test(phoneDigits);

  // ✅ localStorage 안전하게 접근
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
    const todayCount = getTodayCount();
    if (todayCount >= MAX_SMS_PER_DAY) {
      return { ok: false, reason: '오늘은 더 이상 인증번호를 보낼 수 없습니다.' };
    }
    return { ok: true };
  }

  async function sendSms() {
    if (!isValidPhone || sendingCode) return;
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
    } finally {
      setSendingCode(false);
    }
  }

  async function verifySms(code: string) {
    await api.verifySms(phoneDigits, code);
    setCodeVerified(true);
    return true;
  }

  // 이메일 인증
  const [emailVerified, setEmailVerified] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(extra.email);

  async function sendEmail() {
    if (!isValidEmail) return false;
    setEmailVerified(true);
    return true;
  }

  // 약관 토글
  function toggleAllTerms() {
    const v = !terms.all;
    setTerms({ all: v, t1: v, t2: v, t3: v, t4: v, t5: v, mkt: v, third: v });
  }

  // 플래그
  const nameOk = basic.name.trim().length >= 2;
  const birthOk = /^(\d{4})[.\-/]?(0[1-9]|1[0-2])[.\-/]?(0[1-9]|[12]\d|3[01])$/.test(basic.birth.trim());
  const weddingOk = isValidYMD(extra.wedding);
  const phoneOk = isValidPhone && codeRequested && codeVerified;

  const canNextTerms = terms.t1 && terms.t2 && terms.t3 && terms.t4 && terms.t5;
  const canNextBasic = nameOk && birthOk && phoneOk;

  const pwOk = !!extra.pw && extra.pw.length >= 8;
  const pw2Ok = !!extra.pw2 && extra.pw2 === extra.pw;
  const roleOk = !!extra.role;
  const emailOk = isValidEmail;

  const canSubmitExtra = emailOk && pwOk && pw2Ok && roleOk && weddingOk;

  async function submitSignup() {
    if (!canSubmitExtra) throw new Error('필수 항목이 완성되지 않았습니다.');
    if (!canNextBasic) throw new Error('본인확인 단계가 완료되지 않았습니다.');

    const norm = (v: string) =>
      v.trim().replace(/[^0-9]/g, '')
        .replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');

    await api.signup({
      email: extra.email.trim(),
      password: extra.pw,
      name: basic.name.trim(),
      phoneNumber: phoneDigits,
      birthDate: norm(basic.birth),
      weddingDate: norm(extra.wedding),
      type: extra.role === 'groom' ? 'GROOM' : 'BRIDE',
    });
  }

  // ✅ 마운트 시 오늘 남은 횟수 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSmsCount(getTodayCount());
    }
  }, []);

  const smsRemaining = Math.max(0, MAX_SMS_PER_DAY - smsCount);

  return {
    terms, setTerms, basic, setBasic, sendingCode, extra, setExtra,
    isValidPhone, isValidEmail, emailVerified, codeRequested, codeVerified,
    sendSms, verifySms, sendEmail, toggleAllTerms, canSendSms, smsRemaining,

    canNextTerms,
    canNextBasic,
    canSubmitExtra,

    flags: { nameOk, birthOk, phoneOk, emailOk, emailVerified, pwOk, pw2Ok, roleOk, weddingOk },
    submitSignup,
  };
}