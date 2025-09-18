import { ApiEnvelope } from '@/services/http';
import type { Dispatch, SetStateAction } from 'react';

export type Basic = { name: string; birth: string; phone: string };
export type Terms = {
  all: boolean; t1: boolean; t2: boolean; t3: boolean; t4: boolean; t5: boolean;
  mkt?: boolean; third?: boolean;
};
export type Extra = { email: string; pw: string; pw2: string; role: 'groom' | 'bride' | null; wedding: string; };

export type SignupFlags = {
  nameOk: boolean;
  birthOk: boolean;
  phoneOk: boolean;
  emailOk: boolean;
  emailVerified: boolean;
  pwOk: boolean;
  pw2Ok: boolean;
  roleOk: boolean;
  weddingOk: boolean;
};

export type SignupWizardCtx = {
  terms: Terms;
  basic: Basic;
  extra: Extra;

  setTerms: Dispatch<SetStateAction<Terms>>;
  setBasic: Dispatch<SetStateAction<Basic>>;
  setExtra: Dispatch<SetStateAction<Extra>>;

  sendingCode: boolean;
  codeRequested: boolean;
  codeVerified: boolean;
  isValidPhone: boolean;
  sendSms: () => Promise<void>;
  verifySms: (code: string) => Promise<boolean>;
  canSendSms: () => { ok: boolean; reason?: string };
  smsRemaining: number;

  isValidEmail: boolean;
  emailVerified: boolean;
  sendEmail: () => Promise<boolean>;

  toggleAllTerms: () => void;

  canNextTerms: boolean;
  canNextBasic: boolean;
  canSubmitExtra: boolean;

  flags: SignupFlags;
  submitSignup: () => Promise<void>;
};

type SocialSignupResponse = ApiEnvelope<string>;

// 요청 타입 정의
export interface SocialSignupPayload {
  birthDate: string;      // YYYY-MM-DD
  phoneNumber: string;    // "010..."
  weddingDate: string;    // YYYY-MM-DD
  type: "GROOM" | "BRIDE";
}