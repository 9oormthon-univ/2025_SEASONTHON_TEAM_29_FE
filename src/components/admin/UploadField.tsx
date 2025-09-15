'use client';
import { useS3SingleUpload } from '@/hooks/useS3SingleUpload';
import type { UploadDomain } from '@/types/media';
import { useState } from 'react';

export default function UploadField({
  label,
  domain,
  onDone,
}: {
  label: string;
  domain: UploadDomain;
  onDone: (val: { mediaKey: string; contentType: string }) => void;
}) {
  const up = useS3SingleUpload();
  const [domainId, setDomainId] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);

  const submit = async () => {
    if (!file || !domainId) return alert('파일과 domainId를 모두 입력하세요');
    const meta = await up.upload(domain, domainId, file);
    onDone({ mediaKey: meta.s3Key, contentType: meta.contentType });
    setFile(null); // 성공 시 리셋
  };

  return (
    <div className="border rounded p-2 space-y-1">
      <div className="text-sm font-medium">{label}</div>
      <div className="flex gap-2">
        <input
          type="number"
          className="border px-2 py-1 w-28"
          placeholder="domainId"
          value={domainId || ''}
          onChange={(e) => setDomainId(Number(e.target.value))}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)}
        />
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
          onClick={submit}
          disabled={!file || !domainId || up.uploading}
        >
          업로드
        </button>
      </div>
      {up.uploading && <div className="text-xs text-blue-600">업로드 중…</div>}
      {up.error && <div className="text-xs text-red-600">{up.error}</div>}
      {up.issued?.s3Key && (
        <div className="text-xs text-green-700 break-all">완료: {up.issued.s3Key}</div>
      )}
    </div>
  );
}