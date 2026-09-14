import React, { useEffect, useRef, useState } from 'react';
import { EVENT } from '../../data/event';

/**
 * Loops the interval music while `play` is true.
 * Browsers block sound until the page has been clicked once; when that happens
 * `onBlocked` fires and playback retries on the next click or key press.
 */
export const IntervalMusic: React.FC<{ play: boolean; onBlocked?: (blocked: boolean) => void }> = ({ play, onBlocked }) => {
  const ref = useRef<HTMLAudioElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    onBlocked?.(blocked);
  }, [blocked, onBlocked]);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    if (!play) {
      audio.pause();
      audio.currentTime = 0;
      setBlocked(false);
      return;
    }

    audio.volume = 0.7;
    const tryPlay = () =>
      audio
        .play()
        .then(() => setBlocked(false))
        .catch((err: DOMException) => setBlocked(err.name === 'NotAllowedError'));

    tryPlay();
    window.addEventListener('pointerdown', tryPlay);
    window.addEventListener('keydown', tryPlay);
    return () => {
      window.removeEventListener('pointerdown', tryPlay);
      window.removeEventListener('keydown', tryPlay);
    };
  }, [play]);

  return <audio ref={ref} src={EVENT.intervalMusic} loop preload="auto" />;
};

export const isVideoUrl = (url: string | null) => !!url && /\.(mp4|webm|mov)(\?|$)/i.test(url);
