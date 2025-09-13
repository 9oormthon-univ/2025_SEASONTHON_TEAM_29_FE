// src/types/media.ts
export type UploadDomain = 'REVIEW' | 'VENDOR' | 'PRODUCT' | 'INVITATION';

export type IssueUploadUrlRequest = {
  domainId: number;       // ⚠️ 중복 금지 (관리자 입력/검증)
  filename: string;       // File.name 그대로
  contentType: string;    // File.type
  contentLength: number;  // File.size
};

export type IssueUploadUrlResponse = {
  s3Key: string;          // 서버가 최종 결정
  presignedUrl: string;   // PUT 대상
  contentType: string;
  contentLength: number;
};

export type IssuedUpload = IssueUploadUrlResponse & {
  domain: UploadDomain;
  domainId: number;
};