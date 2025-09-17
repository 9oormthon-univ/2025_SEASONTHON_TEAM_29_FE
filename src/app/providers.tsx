'use client';

import { useEffect, useState, type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/query-persist-client-core';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export default function Providers({ children }: PropsWithChildren) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 60 * 60,
            gcTime: 1000 * 60 * 60 * 24 * 7,
          },
        },
      }),
  );

  useEffect(() => {
    const persister = createSyncStoragePersister({
      storage: window.localStorage,
      key: 'weddit-rq',
      throttleTime: 1000,
    });
    persistQueryClient({
      queryClient: client,
      persister,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      buster: 'v1',
    });
  }, [client]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
