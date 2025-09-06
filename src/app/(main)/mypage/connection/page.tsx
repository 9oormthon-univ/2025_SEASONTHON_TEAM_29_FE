// src/app/(main)/mypage/connection/page.tsx
'use client';

import Button from '@/components/common/atomic/Button';
import Input from '@/components/common/atomic/Input';
import Header from '@/components/common/monocules/Header';
import { connectCouple, generateCoupleCode } from '@/services/couple.api';
import { useRouter } from 'next/navigation';
import * as React from 'react';

type Props = {
  onComplete?: () => void;
};

const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : typeof e === 'string' ? e : '알 수 없는 오류가 발생했어요.';

/** 실제 화면 컴포넌트(기본 내보내기 아님) */
function CoupleLinkingView({ onComplete }: Props) {
  const [myCode, setMyCode] = React.useState('');
  const [partnerCode, setPartnerCode] = React.useState('');
  const [isConnected, setIsConnected] = React.useState(false);
  const [loadingGen, setLoadingGen] = React.useState(false);
  const [loadingConn, setLoadingConn] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const bottomDisabled = !isConnected;

  const handleGenerate = async () => {
    try {
      setErrorMsg(null);
      setLoadingGen(true);
      const code = await generateCoupleCode();
      setMyCode(code);
    } catch (e) {
      setErrorMsg(getErrorMessage(e));
    } finally {
      setLoadingGen(false);
    }
  };

  const handleConnect = async () => {
    try {
      setErrorMsg(null);
      setLoadingConn(true);
      await connectCouple(partnerCode);
      setIsConnected(true);
    } catch (e) {
      setErrorMsg(getErrorMessage(e));
    } finally {
      setLoadingConn(false);
    }
  };
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-96 px-6 py-5 space-y-8 pb-28">
        <Header 
        showBack
        onBack={()=>router.back()}
        value="계정연동" />

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-text--default">코드번호 생성</h2>
          <Input
            value={myCode}
            readOnly
            placeholder="본인의 코드를 생성해주세요."
            type={myCode ? 'hover' : 'default'}
            variant="with-badge"
            fullWidth
            className="outline-[1.2px] outline-offset-[-1.2px] outline-box-line h-12"
            badgeText={loadingGen ? '생성중…' : '코드생성'}
            badgeVariant="primary"
            onBadgeClick={handleGenerate}
            badgeDisabled={loadingGen}
          />
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-text--default">배우자 코드 입력</h2>
          <Input
            value={partnerCode}
            onChange={(e) => setPartnerCode(e.currentTarget.value)}
            placeholder="배우자의 코드번호를 입력해주세요."
            type="default"
            variant="with-badge"
            fullWidth
            className="outline-[1.2px] outline-offset-[-1.2px] outline-box-line h-12"
            badgeText={loadingConn ? '확인중…' : '확인'}
            badgeVariant="primary"
            onBadgeClick={handleConnect}
            badgeDisabled={loadingConn || !partnerCode.trim()}
          />
          {isConnected && <p className="text-xs text-primary-500">커플 연동이 완료되었어요.</p>}
        </section>

        {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
      </div>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <div className="w-96 px-6">
          <Button
            size="lg"
            state={bottomDisabled ? 'inactive' : 'default'}
            disabled={bottomDisabled}
            fullWidth
            onClick={() => !bottomDisabled && onComplete?.()}
          >
            연동 완료
          </Button>
        </div>
      </div>
    </div>
  );
}

/** ✅ page.tsx의 기본 내보내기는 props를 받지 않는 래퍼여야 함 */
export default function Page() {
  const router = useRouter();
  return <CoupleLinkingView onComplete={() => router.push('/mypage')} />;
}