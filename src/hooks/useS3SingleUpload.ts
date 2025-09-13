// src/hooks/useS3SingleUpload.ts
'use client';

import { issueUploadUrl, putToPresignedUrl } from '@/services/media.api';
import type { IssuedUpload, UploadDomain } from '@/types/media';
import { useCallback, useRef, useState } from 'react';

export function useS3SingleUpload() {
  const [issued, setIssued] = useState<IssuedUpload | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastDomainIds = useRef<Set<string>>(new Set()); // 프론트 세션 차원의 중복 가드

  const upload = useCallback(
    async (domain: UploadDomain, domainId: number, file: File) => {
      setError(null);

      // 0) 도메인ID 중복 가드(세션 수준)
      const key = `${domain}:${domainId}`;
      if (lastDomainIds.current.has(key)) {
        throw new Error('같은 domainId로 중복 업로드는 금지예요.');
      }

      // 1) 메타 정확화
      const filename = file.name;
      const contentType = file.type || 'application/octet-stream';
      const contentLength = file.size;

      // 2) URL 발급
      const meta = await issueUploadUrl(domain, {
        domainId,
        filename,
        contentType,
        contentLength,
      });

      // 3) 실제 업로드 (발급받은 값과 동일 헤더로)
      setUploading(true);
      try {
        await putToPresignedUrl({
          presignedUrl: meta.presignedUrl,
          file,
          contentType: meta.contentType,
          contentLength: meta.contentLength,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'S3 업로드 실패');
        throw e;
      } finally {
        setUploading(false);
      }

      // 4) 성공 → 세션 중복방지 마킹 및 반환
      lastDomainIds.current.add(key);
      const out: IssuedUpload = { ...meta, domain, domainId };
      setIssued(out);
      return out; // s3Key 포함
    },
    [],
  );

  const reset = useCallback(() => {
    setIssued(null);
    setError(null);
  }, []);

  return { upload, issued, uploading, error, reset };
}