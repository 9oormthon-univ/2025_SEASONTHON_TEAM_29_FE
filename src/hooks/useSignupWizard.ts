// src/hooks/useSignupWizard.ts
'use client';

import * as api from '@/services/auth.api';
import { SignupWizardCtx } from '@/types/auth';
import { useMemo, useState } from 'react';

export type Basic = { name: string; birth: string; phone: string };
export type Terms = { all:boolean; t1:boolean; t2:boolean; t3:boolean; t4:boolean; t5:boolean; mkt?:boolean; third?:boolean };
export type Extra = { email:string; pw:string; pw2:string; role:'groom'|'bride'|null };

export function useSignupWizard(): SignupWizardCtx {
  const [basic, setBasic] = useState<Basic>({ name:'', birth:'', phone:'' });
  const [terms, setTerms] = useState<Terms>({ all:false, t1:false, t2:false, t3:false, t4:false, t5:false, mkt:false, third:false });
  const [extra, setExtra] = useState<Extra>({ email:'', pw:'', pw2:'', role:null });

  // 전화번호 인증
  const [sendingCode, setSendingCode] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
  const isValidPhone = phoneRegex.test(basic.phone.trim());

  async function sendSms() {
    if (!isValidPhone || sendingCode) return;
    setSendingCode(true);
    try {
      await api.sendSms(basic.phone);
      setCodeRequested(true);
      setCodeVerified(false);
    } finally { setSendingCode(false); }
  }
  async function verifySms(code: string) {
    const ok = await api.verifySms(basic.phone, code);
    setCodeVerified(ok);
    return ok;
  }

  // 이메일 인증 (MVP: 전송 성공 시 완료로 처리)
  const [emailVerified, setEmailVerified] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(extra.email);

  async function sendEmail() {
    if (!isValidEmail) return false;
    const ok = await api.sendEmail(extra.email);
    if (ok) setEmailVerified(true);
    return ok;
  }

  // 약관 일괄 토글
  function toggleAllTerms() {
    const v = !terms.all;
    setTerms({ all:v, t1:v, t2:v, t3:v, t4:v, t5:v, mkt:v, third:v });
  }

  // 버튼 활성화
  const canNext0 = useMemo(() =>
    !!(basic.name && basic.birth && isValidPhone && codeRequested && codeVerified),
  [basic, isValidPhone, codeRequested, codeVerified]);

  const canNext1 = useMemo(() =>
    terms.t1 && terms.t2 && terms.t3 && terms.t4 && terms.t5,
  [terms]);

  const canSubmit = useMemo(() => {
    if (!extra.email || !isValidEmail || !emailVerified) return false;
    if (!extra.pw || !extra.pw2 || extra.pw.length < 8 || extra.pw !== extra.pw2) return false;
    if (!extra.role) return false;
    return true;
  }, [extra, emailVerified, isValidEmail]);

  const nameOk  = basic.name.trim().length >= 2; // 단순 예시
  const birthOk = /^(\d{4})[.\-/]?(0[1-9]|1[0-2])[.\-/]?(0[1-9]|[12]\d|3[01])$/.test(basic.birth.trim());
  const phoneOk = isValidPhone && codeRequested && codeVerified;
  
  const canNextTerms = terms.t1 && terms.t2 && terms.t3 && terms.t4 && terms.t5;
  const canNextBasic = nameOk && birthOk && phoneOk;
  
  const pwOk    = !!extra.pw && extra.pw.length >= 8;
  const pw2Ok   = !!extra.pw2 && extra.pw2 === extra.pw;
  const roleOk  = !!extra.role;
  const emailOk = isValidEmail && emailVerified;
  
  const canSubmitExtra = emailOk && pwOk && pw2Ok && roleOk;
  
  // 기존 canNext0/canNext1/canSubmit 대신, 아래를 export
  return {
    // state, actions 등 기존 반환 값들...
    terms, setTerms, basic, setBasic, sendingCode, extra, setExtra,
    isValidPhone, isValidEmail, emailVerified, codeRequested, codeVerified,
    sendSms, verifySms, sendEmail, toggleAllTerms,
  
    // ✅ 스텝별 플래그
    canNextTerms,
    canNextBasic,
    canSubmitExtra,
  
    // (원하면 디버깅/표시 용으로 상세 항목도 노출)
    flags: {
      nameOk,
      birthOk,
      phoneOk,
      emailOk,
      emailVerified, // ← 이 줄 추가!
      pwOk,
      pw2Ok,
      roleOk,
    },
  };
}