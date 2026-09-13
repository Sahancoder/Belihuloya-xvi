import React from 'react';
import { MatchStatus } from '../../types/match';
import { MapPin, Play } from 'lucide-react';

interface LiveBadgeProps {
  status: MatchStatus;
}

export const LiveBadge: React.FC<LiveBadgeProps> = ({ status }) => {
  const isLive = status === 'LIVE';

  return (
    <div className="flex flex-col select-none drop-shadow-[0_4px_18px_rgba(0,0,0,0.28)]">
      {/* Top Row: Red LIVE / Status Pill */}
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#E32636] text-white rounded-l-md shadow-md border-t border-l border-b border-red-400/40">
          {isLive ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          ) : (
            <Play className="w-3 h-3 fill-white text-white" />
          )}
          <span className="text-[11px] font-black tracking-widest uppercase font-display">
            {status}
          </span>
        </div>

        {/* Diagonal Athletic Accent Stripes (Tournament Green, Yellow, Red) */}
        <div className="flex items-center bg-[#061B3A] h-[25px] px-1.5 rounded-r-md border-t border-r border-b border-white/15 overflow-hidden">
          <div className="w-1.5 h-6 bg-[#17C978] transform -skew-x-12 mr-1" />
          <div className="w-1.5 h-6 bg-[#FFD229] transform -skew-x-12 mr-1" />
          <div className="w-1.5 h-6 bg-[#E32636] transform -skew-x-12" />
        </div>
      </div>

      {/* Middle Bar: BELIHULOYA XVI (Navy box with subtle cyan border) */}
      <div className="mt-1 bg-gradient-to-r from-[#061B3A] via-[#0B2B55] to-[#061B3A] border border-[#00D9F5]/40 rounded-lg px-3.5 py-1 shadow-[0_4px_18px_rgba(0,0,0,0.28)] w-fit">
        <span className="text-base md:text-lg font-black tracking-wider text-white uppercase font-display">
          BELIHULOYA XVI
        </span>
      </div>

      {/* Bottom: Location as small white/soft gray text */}
      <div className="flex items-center gap-1.5 mt-1 px-1">
        <MapPin className="w-3 h-3 text-[#00D9F5]" />
        <span className="text-[10px] md:text-[11px] font-semibold tracking-wider text-[#C8D2E1] uppercase font-display drop-shadow">
          BELIHULOYA, SRI LANKA
        </span>
      </div>
    </div>
  );
};
