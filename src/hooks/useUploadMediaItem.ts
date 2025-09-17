'use client';

import { useCallback } from 'react';
import { useS3SingleUpload } from '@/hooks/useS3SingleUpload';
import type { UploadDomain } from '@/types/media';
import type { MediaItem } from '@/types/invitation';

export function useUploadAsMediaItem() {
  const { upload, uploading, error, reset } = useS3SingleUpload();

  const uploadAsMediaItem = useCallback(
    async (args: {
      domain: UploadDomain;
      domainId: number;
      file: File;
      sortOrder: number;
    }): Promise<MediaItem> => {
      const { domain, domainId, file, sortOrder } = args;
      reset();
      const issued = await upload(domain, domainId, file);
      return {
        mediaKey: issued.s3Key,
        contentType: issued.contentType || file.type || '',
        sortOrder,
      };
    },
    [upload, reset],
  );

  return { uploadAsMediaItem, uploading, error };
}
