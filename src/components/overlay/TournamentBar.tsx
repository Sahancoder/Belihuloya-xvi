import React from 'react';

export const TournamentBar: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-[#031834] border-t-2 border-[#17C978] py-1.5 px-6 flex items-center justify-between shadow-[0_4px_18px_rgba(0,0,0,0.28)] select-none">
      {/* 1. Left Tournament Accent Bars (Green, White, Yellow) */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-8 h-2.5 bg-[#17C978] transform -skew-x-12 rounded-sm shadow-sm" />
        <div className="w-8 h-2.5 bg-white transform -skew-x-12 rounded-sm shadow-sm" />
        <div className="w-8 h-2.5 bg-[#FFD229] transform -skew-x-12 rounded-sm shadow-sm" />
      </div>

      {/* 2. Center Tournament Title with Accent Lines */}
      <div className="flex items-center gap-3 text-center">
        <div className="hidden sm:block w-12 md:w-20 h-[1px] bg-gradient-to-r from-transparent to-[#17C978]" />
        <span className="font-extrabold tracking-[0.2em] md:tracking-[0.28em] text-white text-[11px] md:text-xs uppercase font-display drop-shadow">
          BELIHULOYA XVI • SABRA ELLE CHAMPIONSHIP
        </span>
        <div className="hidden sm:block w-12 md:w-20 h-[1px] bg-gradient-to-l from-transparent to-[#17C978]" />
      </div>

      {/* 3. Right Slogan: More Than a Game in Caveat handwritten script */}
      <div className="shrink-0 flex items-center">
        <span className="font-script text-xl md:text-2xl text-white font-bold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          More Than a Game
        </span>
      </div>
    </div>
  );
};
