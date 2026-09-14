import React, { useLayoutEffect, useRef, useState } from 'react';

export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

/** Renders a fixed 1920×1080 canvas scaled to fit its parent, letterboxed. */
export const ScaledStage: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const update = () => {
      const { width, height } = host.getBoundingClientRect();
      setScale(Math.min(width / STAGE_WIDTH, height / STAGE_HEIGHT));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
          visibility: scale ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};
