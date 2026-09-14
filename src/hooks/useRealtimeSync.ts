import { useEffect, useState } from 'react';
import { useMatchStore } from '../store/matchStore';
import { realtimeService } from '../services/realtime';
import { STORAGE_KEY, createSnapshot, sanitizeState } from '../services/persistence';

/** Subscribes the page's store to updates from other windows. Returns sync-server status. */
export const useRealtimeSync = () => {
  const hydrate = useMatchStore((s) => s.hydrate);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    let cancelled = false;

    realtimeService.fetchServerState().then((serverState) => {
      if (cancelled) return;
      const local = useMatchStore.getState();
      if (serverState && serverState.updatedAt > local.updatedAt) {
        hydrate(serverState);
      } else if (!serverState || serverState.updatedAt < local.updatedAt) {
        // Server restarted or is behind: publish what this window has.
        realtimeService.broadcast({ ...createSnapshot(local), history: local.history, updatedAt: local.updatedAt });
      }
    });

    const unsubscribe = realtimeService.subscribe(hydrate);
    const offConnection = realtimeService.onConnection(setServerOnline);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const next = sanitizeState(JSON.parse(event.newValue));
        if (next) hydrate(next);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      cancelled = true;
      unsubscribe();
      offConnection();
      window.removeEventListener('storage', handleStorage);
    };
  }, [hydrate]);

  return serverOnline;
};
