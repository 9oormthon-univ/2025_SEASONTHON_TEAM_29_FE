'use client';

import SvgObject from '@/components/common/atomic/SvgObject';
import { useRouter } from 'next/navigation';
import { useMyInvitationQuery } from '@/hooks/useMyInvitationQuery';
import InvitePreviewBox from './InvitePreviewBox';

export default function InviteCreateCard() {
  const router = useRouter();
  const { data, isLoading, isError } = useMyInvitationQuery();

  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="mx-auto w-40">
          <div className="h-52 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!isError && data?.hasInvitation) {
    return (
      <div className="mt-6">
        <button
          type="button"
          onClick={() => router.push('/mypage/invite/view')}
          className="mx-auto block text-left"
        >
          <InvitePreviewBox imageUrl={data.mainMediaUrl || undefined} />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => router.push('/mypage/invite/editor')}
        className="mx-auto flex h-56 w-full max-w-80 flex-col items-center justify-center text-gray-400"
      >
        <SvgObject src="/icons/plus.svg" />
        <span className="pt-3 text-sm">모바일 청첩장 제작</span>
      </button>
    </div>
  );
}
