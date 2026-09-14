import React, { useEffect, useState } from 'react';
import { MapPin, Radio, Tv } from 'lucide-react';
import { MatchStatus } from '../../types/match';
import { EVENT } from '../../data/event';
import { SafeImage } from '../common/SafeImage';

const STATUSES: { id: MatchStatus; hint: string; active: string }[] = [
  { id: 'READY', hint: 'Waiting screen', active: 'bg-ops-cyan text-[#03202A] shadow-[0_0_18px_rgba(0,207,232,0.35)]' },
  { id: 'LIVE', hint: 'Scoreboard on camera', active: 'bg-ops-green text-[#032A1C] shadow-[0_0_18px_rgba(16,201,129,0.35)]' },
  { id: 'INTERVAL', hint: 'Loop media', active: 'bg-ops-gold text-[#2A1E03] shadow-[0_0_18px_rgba(246,196,69,0.35)]' },
  { id: 'FINISHED', hint: 'Final result', active: 'bg-white text-ops-bg' },
];

const Clock: React.FC = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hidden text-right 2xl:block">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-ops-dim">
        {now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
      </div>
      <div className="font-score text-[26px] font-bold leading-none tabular-nums text-white">
        {now.toLocaleTimeString('en-GB', { hour12: false })}
      </div>
    </div>
  );
};

interface HeaderProps {
  status: MatchStatus;
  matchNumber: number;
  serverOnline: boolean;
  onStatus: (status: MatchStatus) => void;
}

export const Header: React.FC<HeaderProps> = ({ status, matchNumber, serverOnline, onStatus }) => (
  <header className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3 border-b border-white/[0.07] bg-[#051428] px-5 py-3">
    <div className="flex min-w-0 items-center gap-3.5">
      <SafeImage src={EVENT.logo} alt="Belihuloya XVI" fallbackText="XVI" className="h-12 w-12 shrink-0 object-contain" />
      <div className="min-w-0">
        <h1 className="truncate text-[19px] font-black uppercase leading-tight tracking-wide text-white">{EVENT.fullTitle}</h1>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-ops-dim">
          <span className="text-ops-cyan">Score Control</span>
          <span>·</span>
          <span>Match {String(matchNumber).padStart(2, '0')}</span>
        </div>
      </div>
    </div>

    <div className="hidden items-center gap-2.5 rounded-xl border border-white/[0.07] bg-ops-panel px-3.5 py-2 2xl:flex">
      <MapPin className="h-4 w-4 shrink-0 text-ops-cyan" />
      <div className="leading-tight">
        <div className="text-[13px] font-semibold text-white">{EVENT.venue}</div>
        <div className="text-[11px] text-ops-dim">{EVENT.city}</div>
      </div>
    </div>

    <div className="ml-auto flex flex-wrap items-center gap-3">
      <div role="radiogroup" aria-label="Match status" className="flex items-center gap-1 rounded-xl border border-white/10 bg-ops-inset p-1">
        <Radio className="mx-1.5 h-4 w-4 text-ops-dim" aria-hidden />
        {STATUSES.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={status === s.id}
            title={s.hint}
            onClick={() => onStatus(s.id)}
            className={`rounded-lg px-3.5 py-2 text-xs font-extrabold tracking-wider transition ${
              status === s.id ? s.active : 'text-ops-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            {s.id}
          </button>
        ))}
      </div>

      <a
        href="/overlay.html"
        target="_blank"
        rel="noreferrer"
        title={serverOnline ? 'Sync server connected — works with OBS Browser Source' : 'Sync server offline — only tabs in this browser will update'}
        className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-ops-panel px-3 py-1.5 hover:border-ops-cyan/40"
      >
        <Tv className="h-4 w-4 text-ops-cyan" />
        <div className="leading-tight">
          <div className={`flex items-center gap-1.5 text-[12px] font-bold ${serverOnline ? 'text-ops-green' : 'text-ops-gold'}`}>
            <span className={`h-2 w-2 rounded-full ${serverOnline ? 'bg-ops-green' : 'bg-ops-gold'}`} />
            {serverOnline ? 'OBS Sync Online' : 'Local Tab Sync'}
          </div>
          <div className="text-[10px] text-ops-dim">overlay.html · 1920×1080</div>
        </div>
      </a>

      <Clock />
    </div>
  </header>
);
