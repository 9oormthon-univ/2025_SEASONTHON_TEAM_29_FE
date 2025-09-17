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
    <main className="w-full max-w-[420px] mx-auto pb-[96px]">
      <Header showBack onBack={() => router.back()} value="일정 등록하기" />
      <div className="p-5">
        <label className="block text-sm mb-2">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="타이틀을 입력해주세요."
          className="w-full border rounded-lg px-3 py-2"
        />
        <div className="mt-6">
          <Button onClick={submit} disabled={!title.trim() || loading}>
            {loading ? '등록 중…' : '등록하기'}
          </Button>
        </div>
      </div>
    </main>
  );
}