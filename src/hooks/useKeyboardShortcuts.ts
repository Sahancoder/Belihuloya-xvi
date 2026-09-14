import { useEffect } from 'react';
import { useMatchStore } from '../store/matchStore';

/**
 * 1–5 add runs, B adds a ball, O adds an out, U undoes.
 * Disabled while typing in inputs or while a dialog is open.
 */
export const useKeyboardShortcuts = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const tag = el?.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || el?.isContentEditable) return;
      if (event.ctrlKey || event.altKey || event.metaKey || event.repeat) return;

      const store = useMatchStore.getState();
      const key = event.key.toLowerCase();

      if (['1', '2', '3', '4', '5'].includes(key)) {
        store.addRuns(Number(key));
      } else if (key === 'b') {
        store.addBall();
      } else if (key === 'o') {
        store.addOut();
      } else if (key === 'u') {
        store.undoLastAction();
      } else {
        return;
      }
      event.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
};
