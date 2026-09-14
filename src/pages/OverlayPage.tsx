import React, { useEffect, useState } from 'react';
import { useMatchStore } from '../store/matchStore';
import { useRealtimeSync } from '../hooks/useRealtimeSync';
import { ScaledStage } from '../components/common/ScaledStage';
import { OverlayStage } from '../components/overlay/OverlayStage';

/**
 * OBS injects `window.obsstudio` into Browser Sources. Inside OBS the page stays
 * transparent so the camera shows through; in a normal browser window it gets a
 * dark background so it is not shown on white. `?transparent=1` forces OBS mode.
 */
const inObs = () =>
  'obsstudio' in window || new URLSearchParams(window.location.search).get('transparent') === '1';

/** OBS Browser Source (1920×1080). No controls — broadcast graphics only. */
export const OverlayPage: React.FC = () => {
  useRealtimeSync();
  const state = useMatchStore();
  const [obs] = useState(inObs);
  const [musicBlocked, setMusicBlocked] = useState(false);

  useEffect(() => {
    document.body.style.background = obs ? 'transparent' : '#020a16';
  }, [obs]);

  return (
    <>
      <ScaledStage className="h-screen w-screen">
        <OverlayStage state={state} onMusicBlocked={setMusicBlocked} />
      </ScaledStage>
      {musicBlocked && !obs && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white">
          🔊 Click anywhere to enable interval music (not needed inside OBS)
        </div>
      )}
    </>
  );
};
