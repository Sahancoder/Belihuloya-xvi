import React, { useState } from 'react';
import { MatchSnapshot } from '../../types/match';
import { IntervalMusic } from '../common/IntervalMusic';
import { LiveScreen } from './LiveScreen';
import { NormalLiveScreen } from './NormalLiveScreen';
import { IntervalScreen } from './IntervalScreen';
import { FinishedScreen, ReadyScreen } from './StatusScreens';

interface OverlayStageProps {
  state: MatchSnapshot;
  /** Control-panel preview: shows a stand-in camera image and never plays sound. */
  preview?: boolean;
  /** Reports when the browser blocked the music until the page is clicked. */
  onMusicBlocked?: (blocked: boolean) => void;
}

/** The 1920×1080 broadcast canvas. Used by overlay.html and the control panel preview. */
export const OverlayStage: React.FC<OverlayStageProps> = ({ state, preview = false, onMusicBlocked }) => {
  const [videoActive, setVideoActive] = useState(false);
  const isInterval = state.status === 'INTERVAL';
  const onCamera = state.status === 'LIVE' || state.status === 'NORMAL_LIVE';

  return (
    <div className="relative h-[1080px] w-[1920px] overflow-hidden">
      {preview && onCamera && (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1b4a7a_0%,#2c6b3f_55%,#3f7f35_100%)]">
          <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(90deg,transparent_0_120px,rgba(255,255,255,0.08)_120px_240px)]" />
          <div className="absolute inset-0 flex items-center justify-center text-[42px] font-bold tracking-[0.4em] text-white/25">
            CAMERA
          </div>
        </div>
      )}

      {state.status === 'LIVE' && <LiveScreen state={state} />}
      {state.status === 'NORMAL_LIVE' && <NormalLiveScreen />}
      {state.status === 'READY' && <ReadyScreen state={state} />}
      {isInterval && <IntervalScreen state={state} preview={preview} onVideoActive={setVideoActive} />}
      {state.status === 'FINISHED' && <FinishedScreen state={state} />}

      {!preview && (
        <IntervalMusic
          play={isInterval && state.intervalMusic && state.musicOutput === 'overlay' && !videoActive}
          onBlocked={onMusicBlocked}
        />
      )}
    </div>
  );
};
