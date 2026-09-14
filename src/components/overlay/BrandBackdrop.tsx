import React from 'react';
import { EVENT } from '../../data/event';

/** Full-screen dark navy stage with tournament colour streaks, used by READY / INTERVAL / FINISHED. */
export const BrandBackdrop: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="absolute inset-0 overflow-hidden bg-[#041126] font-display text-white">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,#0E3A6B_0%,#072349_38%,#041126_75%)]" />
    <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#8fd8ff_1.2px,transparent_1.2px)] [background-size:22px_22px]" />

    {/* Colour streaks — green / yellow / red top-left, cyan bottom-right */}
    <div className="anim-drift absolute -left-[10%] top-[6%] h-[300px] w-[70%]">
      <div className="absolute top-0 h-[10px] w-full rounded-full bg-gradient-to-r from-transparent via-[#17C978] to-transparent blur-[2px]" />
      <div className="absolute top-[28px] h-[6px] w-[90%] rounded-full bg-gradient-to-r from-transparent via-[#FFD229] to-transparent blur-[1px]" />
      <div className="absolute top-[50px] h-[4px] w-[80%] rounded-full bg-gradient-to-r from-transparent via-[#E32636] to-transparent" />
    </div>
    <div className="anim-drift absolute -right-[12%] bottom-[14%] h-[200px] w-[65%] [animation-delay:-4s]">
      <div className="absolute bottom-0 h-[8px] w-full rounded-full bg-gradient-to-r from-transparent via-[#00D9F5] to-transparent blur-[2px]" />
      <div className="absolute bottom-[24px] h-[4px] w-[85%] rounded-full bg-gradient-to-r from-transparent via-[#17C978] to-transparent" />
    </div>

    {/* Floodlight glows */}
    <div className="anim-glow absolute left-[6%] top-[18%] h-[220px] w-[220px] rounded-full bg-[#9fe7ff] opacity-50 blur-[110px]" />
    <div className="anim-glow absolute right-[6%] top-[14%] h-[220px] w-[220px] rounded-full bg-[#9fe7ff] opacity-50 blur-[110px] [animation-delay:-2s]" />

    {children}

    {/* Footer motto */}
    <div className="absolute inset-x-[120px] bottom-[56px] flex items-center gap-8">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/30" />
      <div className="flex items-center gap-6 text-[22px] font-semibold tracking-[0.6em] text-white/85">
        <span>{EVENT.motto[0]}</span>
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFD229]" />
        <span>{EVENT.motto[1]}</span>
        <span className="h-2.5 w-2.5 rounded-full bg-[#E32636]" />
        <span>{EVENT.motto[2]}</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/30" />
    </div>
  </div>
);

export const VenueLine: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-6 ${className}`}>
    <div className="h-px w-24 bg-[#00D9F5]/60" />
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#00D9F5" aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
    </svg>
    <span className="text-[30px] font-medium tracking-wide text-white/90">{EVENT.venue}</span>
    <div className="h-px w-24 bg-[#00D9F5]/60" />
  </div>
);
