import React, { useEffect, useState } from 'react';
import { IntervalSelection, MatchStatus, TeamSide } from '../types/match';
import { useMatchStore } from '../store/matchStore';
import { useRealtimeSync } from '../hooks/useRealtimeSync';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Header } from '../components/control/Header';
import { TeamSelectPanel } from '../components/control/TeamSelectPanel';
import { ScorePanel } from '../components/control/ScorePanel';
import { MatchFlowPanel } from '../components/control/MatchFlowPanel';
import { PreviewPanel } from '../components/control/PreviewPanel';
import { IntervalMediaPanel } from '../components/control/IntervalMediaPanel';
import { IntervalMusic, isVideoUrl } from '../components/common/IntervalMusic';
import { ActivityPanel } from '../components/control/ActivityPanel';
import { EndTurnDialog, FinishDialog, NewMatchDialog, OverrideDialog, ResetDialog } from '../components/control/Dialogs';

type Dialog = 'endTurn' | 'reset' | 'override' | 'finish' | 'newMatch' | null;

/** Operator console (control.html). Fills the whole browser window. */
export const ControlPage: React.FC = () => {
  const serverOnline = useRealtimeSync();
  const status = useMatchStore((s) => s.status);
  const matchNumber = useMatchStore((s) => s.matchNumber);
  const playMusicHere = useMatchStore(
    (s) => s.status === 'INTERVAL' && s.intervalMusic && s.musicOutput === 'control' && !isVideoUrl(s.interval.mediaUrl)
  );

  const [dialog, setDialog] = useState<Dialog>(null);
  const [activeSlot, setActiveSlot] = useState<TeamSide>('teamA');
  const [setupHighlight, setSetupHighlight] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<IntervalSelection | null>(null);

  useKeyboardShortcuts(dialog === null);

  useEffect(() => {
    if (!setupHighlight) return;
    const t = setTimeout(() => setSetupHighlight(false), 2500);
    return () => clearTimeout(t);
  }, [setupHighlight]);

  const changeStatus = (next: MatchStatus) => {
    const store = useMatchStore.getState();
    if (next === 'FINISHED') {
      setDialog('finish');
    } else if (next === 'INTERVAL') {
      store.playInterval(store.interval);
      setPreviewMedia(null);
    } else {
      store.setStatus(next);
    }
  };

  const close = () => setDialog(null);

  return (
    <div className="flex h-full min-h-screen flex-col bg-ops-bg text-white xl:h-screen xl:overflow-hidden">
      <Header status={status} matchNumber={matchNumber} serverOnline={serverOnline} onStatus={changeStatus} />

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] xl:grid-cols-[minmax(280px,340px)_minmax(560px,1fr)_minmax(420px,0.85fr)]">
        <div className="flex min-h-[640px] flex-col xl:min-h-0">
          <TeamSelectPanel
            activeSlot={activeSlot}
            onActiveSlot={setActiveSlot}
            highlight={setupHighlight}
          />
        </div>

        <div className="flex min-h-0 flex-col gap-3 xl:overflow-y-auto xl:pr-0.5">
          <ScorePanel onOverride={() => setDialog('override')} onReset={() => setDialog('reset')} />
          <MatchFlowPanel onEndTurn={() => setDialog('endTurn')} onFinish={() => setDialog('finish')} onNewMatch={() => setDialog('newMatch')} />
          <ActivityPanel />
        </div>

        <div className="flex min-h-0 flex-col gap-3 lg:col-span-2 xl:col-span-1 xl:overflow-y-auto xl:pr-0.5">
          <PreviewPanel previewMedia={previewMedia} onExitPreview={() => setPreviewMedia(null)} />
          <IntervalMediaPanel previewMedia={previewMedia} onPreview={setPreviewMedia} />
        </div>
      </main>

      <IntervalMusic play={playMusicHere} />

      {dialog === 'endTurn' && <EndTurnDialog onClose={close} />}
      {dialog === 'reset' && <ResetDialog onClose={close} />}
      {dialog === 'override' && <OverrideDialog onClose={close} />}
      {dialog === 'finish' && <FinishDialog onClose={close} />}
      {dialog === 'newMatch' && (
        <NewMatchDialog
          onClose={close}
          onDone={() => {
            setActiveSlot('teamA');
            setSetupHighlight(true);
          }}
        />
      )}
    </div>
  );
};
