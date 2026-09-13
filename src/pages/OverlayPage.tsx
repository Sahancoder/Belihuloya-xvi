import React from 'react';
import { ScoreboardOverlay } from '../components/overlay/ScoreboardOverlay';
import { useRealtimeScore } from '../hooks/useRealtimeScore';

export const OverlayPage: React.FC = () => {
  // Initialize realtime sync hook
  useRealtimeScore();

  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent select-none flex items-center justify-center m-0 p-0">
      <div className="w-[1920px] h-[1080px] max-w-full max-h-full flex">
        <ScoreboardOverlay />
      </div>
    </div>
  );
};
