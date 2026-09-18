import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Eye, MonitorPlay } from 'lucide-react';
import { IntervalSelection, MatchSnapshot, statusLabel } from '../../types/match';
import { useMatchStore } from '../../store/matchStore';
import { ScaledStage } from '../common/ScaledStage';
import { OverlayStage } from '../overlay/OverlayStage';

interface PreviewPanelProps {
  previewMedia: IntervalSelection | null;
  onExitPreview: () => void;
}

const STATUS_BADGE: Record<MatchSnapshot['status'], string> = {
  READY: 'bg-ops-cyan/15 text-ops-cyan',
  LIVE: 'bg-ops-green/15 text-ops-green',
  NORMAL_LIVE: 'bg-ops-red/15 text-ops-red',
  INTERVAL: 'bg-ops-gold/15 text-ops-gold',
  FINISHED: 'bg-white/10 text-white',
};

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ previewMedia, onExitPreview }) => {
  const store = useMatchStore();
  const [copied, setCopied] = useState(false);

  const state: MatchSnapshot = previewMedia ? { ...store, status: 'INTERVAL', interval: previewMedia } : store;
  const overlayUrl = `${window.location.origin}/overlay.html`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(overlayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt('Overlay URL for OBS Browser Source:', overlayUrl);
    }
  };

  return (
    <section aria-label="Live overlay preview" className="panel p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="panel-title">
          <MonitorPlay className="h-4 w-4 text-ops-cyan" />
          OBS Output Preview
        </h2>
        {previewMedia ? (
          <span className="flex items-center gap-1.5 rounded-full bg-ops-gold/15 px-2.5 py-1 text-[11px] font-extrabold tracking-wider text-ops-gold">
            <Eye className="h-3.5 w-3.5" /> PREVIEW ONLY — NOT ON AIR
          </span>
        ) : (
          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wider ${STATUS_BADGE[store.status]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            ON AIR · {statusLabel(store.status)}
          </span>
        )}
      </div>

      <div className={`overflow-hidden rounded-xl border ${previewMedia ? 'border-ops-gold/50' : 'border-white/10'} bg-black`}>
        <ScaledStage className="aspect-video w-full">
          <OverlayStage state={state} preview />
        </ScaledStage>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
        {previewMedia ? (
          <button type="button" onClick={onExitPreview} className="btn-ghost h-8 px-3 text-[11px]">
            Back to on-air view
          </button>
        ) : (
          <span className="text-ops-dim">1920 × 1080 · updates instantly</span>
        )}
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={copy} className="btn-ghost h-8 px-2.5 text-[11px]" title={overlayUrl}>
            {copied ? <Check className="h-3.5 w-3.5 text-ops-green" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy OBS URL'}
          </button>
          <a href="/overlay.html" target="_blank" rel="noreferrer" className="btn-ghost h-8 px-2.5 text-[11px]">
            <ExternalLink className="h-3.5 w-3.5" />
            Open overlay.html
          </a>
        </div>
      </div>
    </section>
  );
};
