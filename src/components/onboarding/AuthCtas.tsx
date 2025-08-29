'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_BASE!;
const APP = process.env.NEXT_PUBLIC_APP_BASE!;

export default function AuthCtas() {
  const router = useRouter();

  const startOAuth = (provider: 'kakao'|'naver'|'google') => {
    const redirect = encodeURIComponent(`${APP}/auth/callback`);
    // 백엔드가 구현할 엔드포인트 형태에 맞춰 두기 (예시)
    window.location.href = `${API}/oauth2/authorize/${provider}?redirect_uri=${redirect}`;
  };

  return (
    <div className="flex flex-col items-center">
      <button className="h-[54px] w-[346px] rounded-[14px] bg-primary-500 text-[15px] font-extrabold text-white shadow-sm"
              onClick={() => router.push('/signin')}>
        이메일로 로그인하기
      </button>

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

function SocialCircle({ src, alt, onClick }: { src:string; alt:string; onClick:()=>void }) {
  return (
    <button onClick={onClick} aria-label={alt} className="grid h-9 w-9 place-items-center rounded-full shadow-[0_1px_6px_rgba(0,0,0,0.12)]">
      <Image src={src} alt="" width={36} height={36} />
    </button>
  );
}