'use client';

import * as React from 'react';
import Input from '@/components/common/atomic/Input';
import Button from '@/components/common/atomic/Button';
import Header from '@/components/common/monocules/Header';
import { tokenStore } from '@/lib/tokenStore';

type Props = {
  onComplete?: () => void;
};
const getErrorMessage = (e: unknown) =>
  e instanceof Error
    ? e.message
    : typeof e === 'string'
      ? e
      : '알 수 없는 오류가 발생했어요.';

export default function CoupleLinkingPage({ onComplete }: Props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_URL) {
    console.error('API URL이 없습니다.');
  }
  const [myCode, setMyCode] = React.useState('');
  const [partnerCode, setPartnerCode] = React.useState('');
  const [isConnected, setIsConnected] = React.useState(false);
  const [loadingGen, setLoadingGen] = React.useState(false);
  const [loadingConn, setLoadingConn] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const bottomDisabled = !isConnected;

  const getToken = () => {
    const raw = tokenStore.get();
    if (!raw) throw new Error('로그인 후 다시 시도해주세요.');
    return raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`;
  };

  const handleGenerate = async () => {
    try {
      setErrorMsg(null);
      setLoadingGen(true);

      const bearer = getToken();
      const res = await fetch(`${API_URL}/v1/couple/code`, {
        method: 'GET',
        headers: { Authorization: bearer },
      });

      if (!res.ok) {
        let serverMsg = '';
        try {
          const maybeJson = await res.json();
          serverMsg =
            maybeJson?.message || maybeJson?.error || maybeJson?.detail || '';
        } catch {}
        throw new Error(
          `코드 생성 실패 (${res.status})${serverMsg ? ` - ${serverMsg}` : ''}`,
        );
      }
      const contentType = res.headers.get('content-type') || '';
      let code = '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        code = data?.data?.coupleCode || data?.coupleCode || data?.code || '';
      } else {
        code = (await res.text()).replaceAll('"', '').trim();
      }

      if (!code) throw new Error('서버에서 코드가 내려오지 않았어요.');
      setMyCode(code);
    } catch (e: unknown) {
      setErrorMsg(getErrorMessage(e));
    } finally {
      setLoadingGen(false);
    }
  };

  const handleConnect = async () => {
    try {
      setErrorMsg(null);
      setLoadingConn(true);

      const bearer = getToken();
      const res = await fetch(`${API_URL}/v1/couple/connect`, {
        method: 'POST',
        headers: {
          Authorization: bearer,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: partnerCode }),
      });

      if (!res.ok) throw new Error(`연결 실패 (${res.status})`);
      setIsConnected(true);
    } catch (e: unknown) {
      setErrorMsg(getErrorMessage(e));
    } finally {
      setLoadingConn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-96 px-6 py-5 space-y-8 pb-28">
        {/* pb-28: 버튼 fixed라 겹치지 않도록 하단 여백 확보 */}
        <Header value="계정연동" />

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-text--default">
            코드번호 생성
          </h2>
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
          <h2 className="text-sm font-medium text-text--default">
            배우자 코드 입력
          </h2>
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
            badgeDisabled={loadingConn || !partnerCode}
          />
          {isConnected && (
            <p className="text-xs text-primary-500">
              커플 연동이 완료되었어요.
            </p>
          )}
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
