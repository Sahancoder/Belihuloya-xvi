import React, { useState } from 'react';
import { useMatchStore } from '../../store/matchStore';
import { ManualScoreModal } from './ManualScoreModal';
import { Edit3 } from 'lucide-react';

export const ScoreControls: React.FC = () => {
  const {
    teamA,
    teamB,
    battingTeam,
    score,
    addRuns,
    decrementRuns,
    addBall,
    decrementBall,
    addOut,
    decrementOut,
    setBattingTeam,
    manualOverrideScore,
  } = useMatchStore();

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const activeTeam = battingTeam === 'teamA' ? teamA : teamB;

  return (
    <div className="bg-[#091426] border border-[#18CFF2]/20 rounded-2xl p-5 shadow-[0_8px_28px_rgba(0,0,0,0.20)] space-y-5 select-none font-display">
      {/* 1. Batting Team Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-[11px] font-bold text-[#6F809B] uppercase tracking-wider block">
            CURRENT BATTING TEAM
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#17C978] shadow-[0_0_8px_rgba(23,201,120,0.6)]" />
            <span className="text-xl md:text-[22px] font-extrabold text-white tracking-wide font-display">
              {activeTeam.code}
            </span>
            <span className="text-[#6F809B] font-light">—</span>
            <span className="text-sm md:text-[15px] font-semibold text-[#A7B2C7] truncate max-w-[280px] md:max-w-[360px]">
              {activeTeam.name}
            </span>
          </div>
        </div>

        {/* Team Switcher Segmented Control */}
        <div className="flex items-center gap-1 bg-[#050B1B] p-1 rounded-xl border border-white/10 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setBattingTeam('teamA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              battingTeam === 'teamA'
                ? 'bg-[#18CFF2] text-[#050B1B] shadow-sm'
                : 'text-[#A7B2C7] hover:text-white'
            }`}
          >
            {teamA.code} (A)
          </button>
          <button
            type="button"
            onClick={() => setBattingTeam('teamB')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              battingTeam === 'teamB'
                ? 'bg-[#18CFF2] text-[#050B1B] shadow-sm'
                : 'text-[#A7B2C7] hover:text-white'
            }`}
          >
            {teamB.code} (B)
          </button>
        </div>
      </div>

      {/* 2. STAT CARDS: RUNS / BALLS / OUTS (Equal Width & Height: ~124px) */}
      <div className="grid grid-cols-3 gap-4">
        {/* RUNS Card */}
        <div className="bg-[#050B1B] border border-[#20D7FF]/30 rounded-xl p-3.5 h-[124px] flex flex-col justify-between items-center text-center shadow-md">
          <span className="text-[11px] font-bold text-[#20D7FF] tracking-widest uppercase">
            RUNS
          </span>
          <div className="font-score font-black text-5xl text-white leading-none my-0.5">
            {score.runs}
          </div>
          <span className="text-[11px] text-[#A7B2C7] font-semibold uppercase">
            BATTING: {activeTeam.code}
          </span>
        </div>

        {/* BALLS Card */}
        <div className="bg-[#050B1B] border border-[#35E6A5]/30 rounded-xl p-3.5 h-[124px] flex flex-col justify-between items-center text-center shadow-md">
          <span className="text-[11px] font-bold text-[#35E6A5] tracking-widest uppercase">
            BALLS
          </span>
          <div className="font-score font-black text-5xl text-white leading-none my-0.5">
            {score.balls}
          </div>
          <span className="text-[11px] text-[#A7B2C7] font-semibold uppercase">
            TOTAL BALLS
          </span>
        </div>

        {/* OUTS Card */}
        <div className="bg-[#050B1B] border border-[#FF5A61]/30 rounded-xl p-3.5 h-[124px] flex flex-col justify-between items-center text-center shadow-md">
          <span className="text-[11px] font-bold text-[#FF5A61] tracking-widest uppercase">
            OUTS
          </span>
          <div className="font-score font-black text-5xl text-[#FF5A61] leading-none my-0.5">
            {score.outs}
          </div>
          <span className="text-[11px] text-[#A7B2C7] font-semibold uppercase">
            WICKETS / OUTS
          </span>
        </div>
      </div>

      {/* 3. RUN CONTROLS (Height: 48px, equal gaps) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#20D7FF] uppercase tracking-wider">
            RUN CONTROLS
          </span>
          <span className="text-[11px] text-[#6F809B] font-medium">
            Shortcuts: 1, 2, 3, 4, 5
          </span>
        </div>
        <div className="grid grid-cols-6 gap-2.5">
          {/* -1 Run Button */}
          <button
            type="button"
            onClick={decrementRuns}
            disabled={score.runs <= 0}
            className="h-12 rounded-xl bg-[#111D31] hover:bg-[#162742] text-[#A7B2C7] hover:text-white font-score font-extrabold text-xl border border-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm flex items-center justify-center"
            title="Subtract 1 Run"
          >
            -1
          </button>

          {/* +1 to +5 Run Buttons */}
          {[1, 2, 3, 4, 5].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => addRuns(amount)}
              className="h-12 rounded-xl bg-gradient-to-b from-[#0A4D80] to-[#083E68] hover:from-[#0C5D9B] hover:to-[#0A4D80] text-white font-score font-extrabold text-xl border border-[#18CFF2]/40 shadow-sm transition active:scale-[0.98] flex items-center justify-center"
              title={`Add ${amount} Run${amount > 1 ? 's' : ''}`}
            >
              +{amount}
            </button>
          ))}
        </div>
      </div>

      {/* 4. BALL + OUT CONTROLS (Equal Width Columns, 48px Buttons) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ball Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#35E6A5] uppercase tracking-wider">
              BALL CONTROLS
            </span>
            <span className="text-[11px] text-[#6F809B] font-medium">Shortcut: B</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={decrementBall}
              disabled={score.balls <= 0}
              className="h-12 rounded-xl bg-[#111D31] hover:bg-[#162742] text-[#A7B2C7] hover:text-white font-score font-bold text-base border border-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              -1 BALL
            </button>
            <button
              type="button"
              onClick={addBall}
              className="h-12 rounded-xl bg-gradient-to-b from-[#138A58] to-[#0E6C44] hover:from-[#16A368] hover:to-[#138A58] text-white font-score font-bold text-base border border-[#35E6A5]/40 shadow-sm transition active:scale-[0.98]"
            >
              +1 BALL
            </button>
          </div>
        </div>

        {/* Out Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FF5A61] uppercase tracking-wider">
              OUT CONTROLS
            </span>
            <span className="text-[11px] text-[#6F809B] font-medium">Shortcut: O</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={decrementOut}
              disabled={score.outs <= 0}
              className="h-12 rounded-xl bg-[#111D31] hover:bg-[#162742] text-[#A7B2C7] hover:text-white font-score font-bold text-base border border-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              -1 OUT
            </button>
            <button
              type="button"
              onClick={addOut}
              className="h-12 rounded-xl bg-gradient-to-b from-[#A3222B] to-[#801B22] hover:from-[#BF2833] hover:to-[#A3222B] text-white font-score font-bold text-base border border-[#FF5A61]/40 shadow-sm transition active:scale-[0.98]"
            >
              +1 OUT
            </button>
          </div>
        </div>
      </div>

      {/* 5. Manual Score Override Thin Utility Row */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-[#6F809B]">
        <span>Emergency score mismatch?</span>
        <button
          type="button"
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-1.5 text-[#18CFF2] hover:underline font-bold transition"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Manual Score Override</span>
        </button>
      </div>

      {/* Manual Modal */}
      <ManualScoreModal
        isOpen={isManualModalOpen}
        currentScore={score}
        onSave={manualOverrideScore}
        onClose={() => setIsManualModalOpen(false)}
      />
    </div>
  );
};
