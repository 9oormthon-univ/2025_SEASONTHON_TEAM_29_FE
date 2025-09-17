import { issueUploadUrl, putToPresignedUrl } from '@/services/media.api';
import type { IssuedUpload, UploadDomain } from '@/types/media';
import { useCallback, useState } from 'react';

export function useS3MultiUpload() {
  const [uploads, setUploads] = useState<IssuedUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadAll = useCallback(
    async (domain: UploadDomain, domainId: number, files: File[]) => {
      setError(null);
      setUploading(true);
      try {
        const results: IssuedUpload[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const meta = await issueUploadUrl(domain, {
            domainId,
            filename: file.name,
            contentType: file.type,
            contentLength: file.size,
          });

          await putToPresignedUrl({
            presignedUrl: meta.presignedUrl,
            file,
            contentType: meta.contentType,
            contentLength: meta.contentLength,
          });

          results.push({ ...meta, domain, domainId });
        }
        setUploads(results);
        return results;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'S3 업로드 실패');
        throw e;
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  return { uploads, uploading, error, uploadAll };
}