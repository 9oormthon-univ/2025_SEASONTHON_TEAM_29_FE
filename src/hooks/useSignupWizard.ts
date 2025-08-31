// src/hooks/useSignupWizard.ts
'use client';

import { isValidYMD } from '@/components/forms/DateInput';
import * as api from '@/services/auth.api';
import { SignupWizardCtx } from '@/types/auth';
import { useState } from 'react';

export type Basic = { name: string; birth: string; phone: string };
export type Terms = {
  all:boolean; t1:boolean; t2:boolean; t3:boolean; t4:boolean; t5:boolean; mkt?:boolean; third?:boolean
};
export type Extra = { email:string; pw:string; pw2:string; role:'groom'|'bride'|null; wedding: string; };

export function useSignupWizard(): SignupWizardCtx {
  const [basic, setBasic] = useState<Basic>({ name:'', birth:'', phone:'' });
  const [terms, setTerms] = useState<Terms>({
    all:false, t1:false, t2:false, t3:false, t4:false, t5:false, mkt:false, third:false
  });
  const [extra, setExtra] = useState<Extra>({ email:'', pw:'', pw2:'', role:null, wedding:'' });

  // 전화번호 인증
  const [sendingCode, setSendingCode] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const phoneDigits = basic.phone.replace(/\D/g, ''); // 숫자만
  const isValidPhone = /^010\d{8}$/.test(phoneDigits);

  async function sendSms() {
    if (!isValidPhone || sendingCode) return;
    setSendingCode(true);
    try {
      await api.sendSms(phoneDigits);
      setCodeRequested(true);
      setCodeVerified(false);
    } finally {
      setSendingCode(false);
    }
  }

  async function verifySms(code: string) {
    await api.verifySms(code); // 성공/실패는 서버 에러로 판별
    setCodeVerified(true);
    return true;
  }

  // 이메일 (스펙에 Email 인증 API 없음 → MVP로 즉시 완료 처리)
  const [emailVerified, setEmailVerified] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(extra.email);

  async function sendEmail() {
    if (!isValidEmail) return false;
    setEmailVerified(true);
    return true;
  }

  // 약관 일괄 토글
  function toggleAllTerms() {
    const v = !terms.all;
    setTerms({ all:v, t1:v, t2:v, t3:v, t4:v, t5:v, mkt:v, third:v });
  }

  // 플래그
  const nameOk    = basic.name.trim().length >= 2;
  const birthOk   = /^(\d{4})[.\-/]?(0[1-9]|1[0-2])[.\-/]?(0[1-9]|[12]\d|3[01])$/.test(basic.birth.trim());
  const weddingOk = isValidYMD(extra.wedding);
  const phoneOk   = isValidPhone && codeRequested && codeVerified;

  const canNextTerms   = terms.t1 && terms.t2 && terms.t3 && terms.t4 && terms.t5;
  const canNextBasic   = nameOk && birthOk && phoneOk;

  const pwOk    = !!extra.pw && extra.pw.length >= 8;
  const pw2Ok   = !!extra.pw2 && extra.pw2 === extra.pw;
  const roleOk  = !!extra.role;
  const emailOk = isValidEmail;

  const canSubmitExtra = emailOk && pwOk && pw2Ok && roleOk && weddingOk;

  // ✅ 최종 회원가입 호출
  async function submitSignup() {
    // 가드
    if (!canSubmitExtra) throw new Error('필수 항목이 완성되지 않았습니다.');
    if (!canNextBasic)   throw new Error('본인확인 단계가 완료되지 않았습니다.');

    // YYYY-MM-DD 로 정규화 (isValidYMD 통과한다고 가정)
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

  return {
    // state, actions
    terms, setTerms, basic, setBasic, sendingCode, extra, setExtra,
    isValidPhone, isValidEmail, emailVerified, codeRequested, codeVerified,
    sendSms, verifySms, sendEmail, toggleAllTerms,

    // 스텝별 플래그
    canNextTerms,
    canNextBasic,
    canSubmitExtra,

    // 추가 공개 플래그
    flags: { nameOk, birthOk, phoneOk, emailOk, emailVerified, pwOk, pw2Ok, roleOk, weddingOk },

    // 🔗 최종 제출
    submitSignup,
  } as SignupWizardCtx & { submitSignup: () => Promise<void> };
}