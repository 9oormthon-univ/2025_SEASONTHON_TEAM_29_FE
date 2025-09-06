'use client';

import SvgObject from '@/components/common/atomic/SvgObject';

export default function ProfileHeader({ loading, error, name, type, partnerName, coupled }: {
  loading: boolean; error: string | null; name?: string; type?: string; partnerName?: string; coupled?: boolean;
}) {
  const suffix = type?.toUpperCase() === 'BRIDE' ? ' 신부님' : type?.toUpperCase() === 'GROOM' ? ' 신랑님' : ' 고객님';
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <SvgObject src="/defaultProfile.svg" alt="profile" width={88} height={88} className="rounded-full" />
      <div className="text-[17px] font-medium">{loading ? '로딩 중…' : (name ?? '회원') + suffix}</div>
      {error ? (
        <span className="text-[13px] text-red-500">프로필 불러오기 실패</span>
      ) : coupled ? (
        <span className="text-[13px] text-emerald-600">연결됨{partnerName ? ` · ${partnerName}` : ''}</span>
      ) : (
        <a href="/mypage/connection" className="text-[13px] text-rose-400 underline">예비 배우자와 연결하기</a>
      )}
    </div>
  );
}