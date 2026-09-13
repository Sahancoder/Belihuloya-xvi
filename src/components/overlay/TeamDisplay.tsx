import React from 'react';
import { University } from '../../types/university';

interface TeamDisplayProps {
  team: University;
  isBatting: boolean;
  align?: 'left' | 'right';
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({
  team,
  isBatting,
  align = 'left',
}) => {
  const isLeft = align === 'left';
  const displayName = (team.shortName || team.name).toUpperCase();

  return (
    <div className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} select-none font-display`}>
      {/* Athletic End-Cap Stripe (Tournament Green & White) */}
      <div
        className={`h-16 md:h-18 w-2 md:w-2.5 transition-all duration-300 shadow-md ${
          isLeft ? 'rounded-l-xl' : 'rounded-r-xl'
        } ${
          isBatting
            ? 'bg-[#17C978] shadow-[0_0_14px_rgba(23,201,120,0.6)]'
            : 'bg-white/40'
        }`}
      />

      {/* Main Team Panel: Dark Navy with Tournament Green & White Hierarchy */}
      <div
        className={`relative flex flex-col justify-center py-2.5 md:py-3 px-6 md:px-8 min-w-[200px] md:min-w-[240px] shadow-[0_4px_18px_rgba(0,0,0,0.28)] border-t border-b transition-all duration-300 ${
          isLeft
            ? 'rounded-r-2xl text-left bg-gradient-to-r from-[#061B3A] via-[#0A2E23] to-[#061B3A] border-r border-[#17C978]/40'
            : 'rounded-l-2xl text-right bg-gradient-to-l from-[#061B3A] via-[#0A2E23] to-[#061B3A] border-l border-[#17C978]/40'
        } ${
          isBatting
            ? 'border-t-[#17C978] border-b-[#17C978] shadow-[0_0_20px_rgba(23,201,120,0.25)]'
            : 'border-t-white/20 border-b-white/20'
        }`}
      >
        {/* Batting Indicator Pill: ● BATTING */}
        {isBatting && (
          <div className={`flex items-center mb-0.5 ${isLeft ? 'justify-start' : 'justify-end'}`}>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#17C978]/20 border border-[#17C978] text-[#17C978] text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(23,201,120,0.4)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#17C978] animate-ping" />
              BATTING
            </span>
          </div>
        )}

        {/* University Code: Crisp Bold White */}
        <div className={`flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
          <span className="font-display font-black text-3xl md:text-4xl text-white tracking-wider leading-none drop-shadow-md">
            {team.code}
          </span>
        </div>

        {/* University Short Name: Tournament Green */}
        <span className="text-xs md:text-[13px] font-bold text-[#17C978] mt-0.5 uppercase tracking-wider font-display drop-shadow truncate max-w-[200px] md:max-w-[240px]">
          {displayName}
        </span>
      </div>
    </div>
  );
};
