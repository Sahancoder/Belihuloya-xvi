import { useEffect } from 'react';
import { useMatchStore } from '../store/matchStore';
import { realtimeService } from '../services/realtime';
import { loadFromLocalStorage } from '../services/persistence';

export const useRealtimeScore = () => {
  const hydrateFromSnapshot = useMatchStore((s) => s.hydrateFromSnapshot);

  useEffect(() => {
    // 1. Initial hydration from localStorage
    const saved = loadFromLocalStorage();
    hydrateFromSnapshot(saved, saved.lastSavedTime, saved.updatedAt);

    // 2. Realtime listener for broadcast updates
    const unsubscribe = realtimeService.subscribe((message) => {
      if (message.type === 'MATCH_STATE_UPDATED') {
        const { lastSavedTime, updatedAt, ...snapshot } = message.payload;
        hydrateFromSnapshot(snapshot, lastSavedTime, updatedAt);
      }
    });

    // 3. Storage event listener (backup for same-origin tabs in case BroadcastChannel is interrupted)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'belihuloya_match_state' && event.newValue) {
        try {
          const fresh = JSON.parse(event.newValue);
          hydrateFromSnapshot(fresh, fresh.lastSavedTime, fresh.updatedAt);
        } catch (e) {
          console.warn('Failed to parse storage event update:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, [hydrateFromSnapshot]);
};
