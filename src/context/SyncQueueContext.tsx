import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { getSyncQueue, subscribeToSyncQueueChanges } from '@/src/services/syncManager';

const ACTIVE_SYNC_STATUSES = new Set(['PENDING', 'SYNCING']);

const SyncPendingCountContext = createContext<number | null>(null);

type SyncQueueProviderProps = {
  children: ReactNode;
};

export const SyncQueueProvider = ({ children }: SyncQueueProviderProps) => {
  const [syncPendingCount, setSyncPendingCount] = useState(0);

  useEffect(() => {
    const refreshSyncState = async () => {
      const queue = await getSyncQueue();
      const activeCount = queue.filter((task) => ACTIVE_SYNC_STATUSES.has(task.status)).length;
      setSyncPendingCount(activeCount);
    };

    refreshSyncState();

    const unsubscribeQueue = subscribeToSyncQueueChanges(() => {
      refreshSyncState();
    });

    return () => unsubscribeQueue();
  }, []);

  return <SyncPendingCountContext.Provider value={syncPendingCount}>{children}</SyncPendingCountContext.Provider>;
};

export const useSyncPendingCountContext = () => {
  const contextValue = useContext(SyncPendingCountContext);

  if (contextValue === null) {
    throw new Error('useSyncPendingCount must be used within SyncQueueProvider');
  }

  return contextValue;
};
