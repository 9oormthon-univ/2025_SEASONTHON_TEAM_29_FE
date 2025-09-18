'use client';

import Button from '@/components/common/atomic/Button';
import Header from '@/components/common/monocules/Header';
import { createTourRomance } from '@/services/tourRomance.api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewRomancePage() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createTourRomance({ title });
      router.replace('/tours'); // 등록 후 투어일지 메인으로
    } catch (e) {
      alert(e instanceof Error ? e.message : '등록 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-[420px] mx-auto min-h-screen pb-[96px]">
      <Header showBack onBack={() => router.back()} value="일정 등록하기" />
      <div className="p-5 pb-32"> {/* 입력 내용 영역 */}
        <label className="block text-md font-bold mb-2">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="타이틀을 입력해주세요."
          className="w-full border border-gray-200 rounded-lg px-3 py-3"
        />
      </div>

      {/* 🔥 하단 고정 버튼 */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pb-[48px]">
        <div className="w-full max-w-[420px] px-5">
          <Button onClick={submit} disabled={!title.trim() || loading} fullWidth>
            {loading ? '등록 중…' : '등록하기'}
          </Button>
        </div>
      </div>
    </main>
  );
}