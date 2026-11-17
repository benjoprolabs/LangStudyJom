import { useCallback, useEffect, useState } from 'react';
import { getPersistenceStatus, requestPersistentStorage } from '@/db/bootstrap';

export interface StorageStatus {
  persisted: boolean | null;
  usage?: number;
  quota?: number;
}

export function useStorageStatus() {
  const [status, setStatus] = useState<StorageStatus>({ persisted: null });

  const refresh = useCallback(async () => {
    const persisted = await getPersistenceStatus();
    let usage: number | undefined;
    let quota: number | undefined;
    try {
      const est = await navigator.storage?.estimate?.();
      usage = est?.usage;
      quota = est?.quota;
    } catch {
      /* not supported */
    }
    setStatus({ persisted, usage, quota });
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const request = useCallback(async () => {
    const granted = await requestPersistentStorage();
    await refresh();
    return granted;
  }, [refresh]);

  return { status, refresh, request };
}
