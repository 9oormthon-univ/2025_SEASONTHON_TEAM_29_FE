// src/services/media.api.ts
import { http } from '@/services/http';
import type { IssueUploadUrlRequest, IssueUploadUrlResponse, UploadDomain } from '@/types/media';
import type { ApiEnvelope } from '@/types/vendor';

/** Presigned URL 발급 */
export async function issueUploadUrl(
  domain: UploadDomain,
  body: IssueUploadUrlRequest,
): Promise<IssueUploadUrlResponse> {
  const res = await http<ApiEnvelope<IssueUploadUrlResponse>>(
    `/v1/s3/${encodeURIComponent(domain)}/upload-url`, // ✅ 대문자 그대로
    { method: 'PUT', body: JSON.stringify(body) },
  );
  if (!res.data) throw new Error('업로드 URL 발급 실패');
  return res.data;
}

/** 단일 파일 PUT 업로드 */
export async function putToPresignedUrl(args: {
  presignedUrl: string;
  file: File | Blob;
  contentType: string;
  contentLength: number; // 참고용
  signal?: AbortSignal;
}): Promise<void> {
  const { presignedUrl, file, contentType, signal } = args;

  const res = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType }, // ✅ Content-Length 넣지 않음
    body: file,
    signal,
  }).catch(() => null);

  if (!res || !res.ok) {
    const text = await res?.text().catch(() => '');
    throw new Error(`S3 업로드 실패 (HTTP ${res?.status ?? 0})${text ? ` - ${text}` : ''}`);
  }
}