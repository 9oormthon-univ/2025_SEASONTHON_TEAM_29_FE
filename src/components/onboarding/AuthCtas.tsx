'use client';
import { useRouter } from 'next/navigation';
import Button from '../common/atomic/Button';
import { SocialCircle } from '../common/atomic/SocialCircle';

const API = process.env.NEXT_PUBLIC_API_URL!;   // ex) https://wedit.me/api
const APP = process.env.NEXT_PUBLIC_SITE_URL!;

export default function AuthCtas() {
  const router = useRouter();

  function startOAuth(provider: 'kakao'|'naver'|'google') {
    const redirect = encodeURIComponent(`${APP}/auth/callback`);
    window.location.href = `${API}/oauth2/authorization/${provider}?redirect_uri=${redirect}`;
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        fullWidth
        size="md"
        onClick={() => router.push('/login')}
        className="h-[54px] max-w-[346px] text-[15px] font-extrabold shadow-sm"
      >
        이메일로 로그인하기
      </Button>

      <div className="mt-4 flex items-center justify-center gap-5">
        <SocialCircle src="/icons/Social/kakao.svg"  alt="카카오 로그인" onClick={() => startOAuth('kakao')} />
        <SocialCircle src="/icons/Social/naver.svg"  alt="네이버 로그인" onClick={() => startOAuth('naver')} />
        <SocialCircle src="/icons/Social/google.svg" alt="구글 로그인"  onClick={() => startOAuth('google')} />
      </div>

      <button className="mt-4 text-sm text-primary-500 underline" onClick={() => router.push('/signup')}>
        회원가입
      </button>
    </div>
  );
}