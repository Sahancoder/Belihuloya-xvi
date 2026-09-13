import React from 'react';
import { useMatchStore } from '../store/matchStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { MatchStatus } from '../types/match';
import { MatchSetup } from '../components/admin/MatchSetup';
import { ScoreControls } from '../components/admin/ScoreControls';
import { InningsControls } from '../components/admin/InningsControls';
import { ResetControls } from '../components/admin/ResetControls';
import { RecentActions } from '../components/admin/RecentActions';
import { LivePreview } from '../components/admin/LivePreview';
import { KeyboardShortcutsHelp } from '../components/admin/KeyboardShortcutsHelp';
import { SafeImage } from '../components/common/SafeImage';
import { Radio, ShieldCheck, Clock, GraduationCap } from 'lucide-react';

export const AdminPage: React.FC = () => {
  // Activate keyboard shortcuts
  useKeyboardShortcuts({ enabled: true });

  const {
    status,
    setStatus,
    lastSavedTime,
    showUniversitiesCard,
    setShowUniversitiesCard,
  } = useMatchStore();

  const statuses: MatchStatus[] = ['READY', 'LIVE', 'INTERVAL', 'FINISHED'];

  const getStatusButtonClass = (s: MatchStatus) => {
    const isActive = status === s;
    if (!isActive) {
      return 'text-[#A7B2C7] hover:text-white bg-transparent hover:bg-white/5';
    }
    switch (s) {
      case 'LIVE':
        return 'bg-[#F43F4B] text-white shadow-sm font-black';
      case 'INTERVAL':
        return 'bg-[#F59E0B] text-white shadow-sm font-black';
      case 'FINISHED':
        return 'bg-[#20D695] text-[#050B1B] shadow-sm font-black';
      case 'READY':
      default:
        return 'bg-[#18CFF2] text-[#050B1B] shadow-sm font-black';
    }
  };

  return (
    <div className="min-h-screen bg-[#050B1B] text-[#F8FAFC] py-6 px-4 md:px-6 overflow-y-auto font-display antialiased select-none">
      {/* Centered Dashboard Shell: max-w-[1540px] */}
      <div className="max-w-[1540px] w-full mx-auto space-y-5">
        {/* COMPACT TOP CONTROL HEADER (~92-105px) */}
        <header className="bg-[#091426] border border-[#18CFF2]/20 rounded-2xl p-4 md:px-6 md:py-4 shadow-[0_8px_28px_rgba(0,0,0,0.20)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left: Tournament Identity */}
          <div className="flex items-center gap-3.5">
            <SafeImage
              src="/tournament/belihuloya-xvi-logo.png"
              alt="Belihuloya XVI"
              fallbackText="BXVI"
              fallbackBg="#091426"
              className="w-11 h-11 object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold tracking-[0.08em] text-[#18CFF2] uppercase font-display">
                  OBS Score Control System
                </span>
                <span className="w-1 h-1 rounded-full bg-[#6F809B]" />
                <span className="text-[11px] font-medium text-[#6F809B]">
                  Single Laptop Edition
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-[#F8FAFC] tracking-wide uppercase font-display leading-tight">
                Belihuloya XVI Sabra Elle Championship
              </h1>
            </div>
          </div>

          {/* Right: Consolidated Status & System Cluster */}
          <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
            {/* Status Selector Segment */}
            <div className="flex items-center bg-[#050B1B] border border-white/10 p-1 rounded-xl">
              <span className="text-[11px] font-bold text-[#A7B2C7] uppercase px-2 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#18CFF2]" />
                <span>STATUS:</span>
              </span>
              <div className="flex items-center gap-1">
                {statuses.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-3 py-1 rounded-lg text-xs tracking-wider transition ${getStatusButtonClass(s)}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Universities Card Toggle */}
            <button
              type="button"
              onClick={() => setShowUniversitiesCard(!showUniversitiesCard)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                showUniversitiesCard
                  ? 'bg-[#20D695]/15 border-[#20D695]/50 text-[#20D695]'
                  : 'bg-[#050B1B] border-white/10 text-[#A7B2C7] hover:text-white'
              }`}
              title="Toggle Participating Universities Card on Broadcast Overlay"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Uni Card: {showUniversitiesCard ? 'ON' : 'OFF'}</span>
            </button>

            {/* Autosave Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#050B1B] border border-white/10 rounded-xl text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#20D695]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#20D695] leading-tight">
                  Auto Save Active
                </span>
                <span className="text-[9px] text-[#6F809B] font-mono flex items-center gap-1 leading-tight">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{lastSavedTime}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN 2-COLUMN BALANCED GRID (65% Control / 35% Monitoring) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Controls & Management (~65% / 8 cols or 7 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* 1. Score Controls (Primary Operator Focus) */}
            <ScoreControls />

            {/* 2. Innings & Side Controls (Compact) */}
            <InningsControls />

            {/* 3. Match Setup & Teams */}
            <MatchSetup />

            {/* 4. Safety Reset Zone */}
            <ResetControls />
          </div>

          {/* RIGHT COLUMN: Real-Time Preview & Actions (~35% / 5 cols or 4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5">
            {/* 1. Live Scaled Preview (High Priority for Operator) */}
            <LivePreview />

            {/* 2. Recent Actions (Compact Scroll Panel) */}
            <RecentActions />

            {/* 3. Keyboard Shortcuts Reference (Compact Helper) */}
            <KeyboardShortcutsHelp />
          </div>
        </div>
      </div>
    </div>
  );
};
