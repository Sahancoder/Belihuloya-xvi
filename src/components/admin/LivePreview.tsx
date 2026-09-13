import React from 'react';
import { ScoreboardOverlay } from '../overlay/ScoreboardOverlay';
import { Monitor, ExternalLink } from 'lucide-react';

export const LivePreview: React.FC = () => {
  return (
    <div className="bg-[#091426] border border-[#18CFF2]/20 rounded-2xl p-4 md:p-5 shadow-[0_8px_28px_rgba(0,0,0,0.20)] space-y-3.5 select-none font-display">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-[#18CFF2]" />
          <h3 className="font-extrabold text-sm tracking-wider text-white uppercase font-display">
            LIVE OVERLAY PREVIEW (OBS OUTPUT)
          </h3>
        </div>

        <a
          href="/overlay"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-[#18CFF2] hover:underline font-bold transition"
          title="Open Overlay in New Tab"
        >
          <span>Open Clean Overlay</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 16:9 Container with scaled real overlay */}
      <div className="relative w-full aspect-video bg-[#020D20] rounded-xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
        {/* Subtle grid pattern for camera backdrop representation */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#00D9F5_1px,transparent_1px)] [background-size:16px_16px]"
        />

        {/* Scaled production overlay */}
        <div className="w-full h-full transform scale-100 origin-top-left">
          <ScoreboardOverlay isScaledPreview={true} />
        </div>
      </div>

      {/* Clean Utility Footer */}
      <div className="flex items-center justify-between text-[11px] text-[#6F809B] font-medium px-1">
        <span>Canvas: 1920 × 1080 (16:9)</span>
        <span className="text-[#18CFF2]/80">Real-time sync via BroadcastChannel</span>
      </div>
    </div>
  );
};
