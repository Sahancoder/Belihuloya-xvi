import React from 'react';
import { SafeImage } from '../common/SafeImage';

export const TournamentLogo: React.FC = () => {
  return (
    <div className="relative select-none flex flex-col items-end">
      {/* Subtle translucent plate for optimal broadcast camera contrast */}
      <div className="relative bg-[#061B3A]/65 backdrop-blur-md rounded-2xl p-2.5 md:p-3 border border-white/10 shadow-[0_4px_18px_rgba(0,0,0,0.28)] flex flex-col items-center justify-center overflow-hidden">
        {/* Thin Tournament Color Accent Lines (Green, Yellow, Red) at Top */}
        <div className="absolute top-0 left-0 right-0 h-[3px] flex">
          <div className="flex-1 bg-[#17C978]" />
          <div className="flex-1 bg-[#FFD229]" />
          <div className="flex-1 bg-[#E32636]" />
        </div>

        {/* Tournament Logo Image (Transparent PNG) */}
        <SafeImage
          src="/tournament/belihuloya-xvi-logo.png"
          alt="Belihuloya XVI Sabra Elle Championship"
          fallbackText="BXVI"
          fallbackBg="#061B3A"
          className="w-28 h-20 md:w-36 md:h-24 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        />

        {/* Motto / Slogan underneath */}
        <div className="mt-1 flex items-center gap-2 text-[9px] font-extrabold tracking-widest text-[#C8D2E1] uppercase font-display">
          <span>PLAY</span>
          <span className="w-1 h-1 rounded-full bg-[#17C978]" />
          <span>UNITE</span>
          <span className="w-1 h-1 rounded-full bg-[#FFD229]" />
          <span>RISE</span>
        </div>
      </div>
    </div>
  );
};
