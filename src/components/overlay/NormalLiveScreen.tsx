import React from 'react';
import { EVENT } from '../../data/event';
import { SafeImage } from '../common/SafeImage';

/**
 * NORMAL LIVE state: ceremonies, speeches, awards. Transparent canvas so the camera
 * stays unobstructed; only a broadcast-safe branding footer, no match information at all.
 * Safe area at 1920×1080: 56px left/right, 36px bottom.
 */
export const NormalLiveScreen: React.FC = () => (
  <div className="absolute inset-0 font-display text-white">
    <div className="anim-slide-up absolute bottom-[36px] left-[56px] right-[56px]">
      {/* Logo overhangs the bar so it reads at a larger size without a taller footer. */}
      <div className="absolute bottom-[-6px] left-[20px] z-10 flex h-[136px] w-[136px] items-center justify-center rounded-full border-[3px] border-white/15 bg-[#061B3A] shadow-[0_8px_28px_rgba(0,0,0,0.45)]">
        <SafeImage src={EVENT.logo} alt="Belihuloya XVI" fallbackText="XVI" className="h-[112px] w-[112px] object-contain" />
      </div>

      <div className="relative flex h-[92px] items-center overflow-hidden rounded-[10px] border border-white/10 bg-gradient-to-b from-[#0A2A55]/95 to-[#061B3A]/95 pl-[184px] pr-9 shadow-[0_-4px_28px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-x-0 bottom-0 flex h-[3px] opacity-90">
          <div className="flex-1 bg-[#17C978]" />
          <div className="flex-1 bg-[#FFD229]" />
          <div className="flex-1 bg-[#E32636]" />
          <div className="flex-1 bg-[#00D9F5]" />
        </div>

        {/* Left: event branding */}
        <div className="shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[44px] font-black leading-none tracking-wide">{EVENT.title}</span>
            <span className="flex items-center gap-2 rounded-full border border-white/25 px-3 py-1 text-[13px] font-extrabold tracking-[0.2em] text-white/90">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#E32636]" />
              EVENT LIVE
            </span>
          </div>
          <div className="mt-2 text-[17px] font-bold uppercase leading-none tracking-[0.32em] text-[#FFD229]">{EVENT.subtitle}</div>
        </div>

        {/* Middle: optional sponsor strip */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-8 px-8">
          {EVENT.sponsors.map((src) => (
            <SafeImage key={src} src={src} alt="Sponsor" fallbackText="" fallbackBg="transparent" className="h-[56px] max-w-[160px] object-contain" />
          ))}
        </div>

        {/* Right: host university and location */}
        <div className="flex min-w-0 max-w-[560px] shrink items-center gap-7">
          <div className="h-[52px] w-px shrink-0 bg-white/20" />
          <div className="min-w-0 text-right">
            <div className="line-clamp-2 text-[25px] font-bold leading-[1.1] tracking-wide">{EVENT.venue}</div>
            <div className="mt-1.5 text-[17px] font-semibold uppercase leading-none tracking-[0.22em] text-[#C8D2E1]">
              {EVENT.city.replace(', ', ' • ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
