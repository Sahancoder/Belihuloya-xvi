import { useEffect } from 'react';
import { useMatchStore } from '../store/matchStore';

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({ enabled = true }: UseKeyboardShortcutsOptions = {}) => {
  const addRuns = useMatchStore((s) => s.addRuns);
  const addBall = useMatchStore((s) => s.addBall);
  const addOut = useMatchStore((s) => s.addOut);
  const undoLastAction = useMatchStore((s) => s.undoLastAction);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is inside an input, textarea, or select
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        activeTag === 'select' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      // Ignore if modifier keys (Ctrl, Alt, Meta) are held
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      switch (event.key) {
        case '1':
          event.preventDefault();
          addRuns(1);
          break;
        case '2':
          event.preventDefault();
          addRuns(2);
          break;
        case '3':
          event.preventDefault();
          addRuns(3);
          break;
        case '4':
          event.preventDefault();
          addRuns(4);
          break;
        case '5':
          event.preventDefault();
          addRuns(5);
          break;
        case 'b':
        case 'B':
          event.preventDefault();
          addBall();
          break;
        case 'o':
        case 'O':
          event.preventDefault();
          addOut();
          break;
        case 'u':
        case 'U':
          event.preventDefault();
          undoLastAction();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, addRuns, addBall, addOut, undoLastAction]);
};
