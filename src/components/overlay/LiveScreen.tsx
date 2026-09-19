import React, { useEffect, useRef, useState } from 'react';
import { MatchSnapshot, TeamSide } from '../../types/match';
import { EVENT } from '../../data/event';
import { pad2 } from '../../services/result';
import { TeamLogo } from '../common/TeamLogo';
import { SafeImage } from '../common/SafeImage';

/** Number that briefly pops when it changes. */
const StatValue: React.FC<{ value: number; className: string }> = ({ value, className }) => {
  const [tick, setTick] = useState(0);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value;
      setTick((t) => t + 1);
    }
  }, [value]);
  return (
    <span key={tick} className={`${tick ? 'anim-bump' : ''} inline-block font-score font-extrabold leading-none ${className}`}>
      {pad2(value)}
    </span>
  );
};

const TeamBlock: React.FC<{ state: MatchSnapshot; side: TeamSide }> = ({ state, side }) => {
  const team = state[side];
  const batting = state.battingTeam === side;
  const done = state.turnDone[side];
  const score = state.scores[side];
  const right = side === 'teamB';

  return (
    <div className={`flex h-full min-w-0 flex-1 items-center gap-4 px-6 ${right ? 'flex-row-reverse text-right' : ''}`}>
      <TeamLogo team={team} size={70} className={`ring-[3px] ${batting ? 'ring-[#17C978]' : 'ring-white/15'}`} />
      <div className="min-w-0 flex-1">
        <div className={`flex items-center gap-3 ${right ? 'flex-row-reverse' : ''}`}>
          <span className="font-score text-[42px] font-extrabold leading-none tracking-wide text-white">{team.code}</span>
          {batting && (
            <span className="flex items-center gap-1.5 rounded bg-[#17C978] px-2 py-0.5 text-[13px] font-black tracking-[0.18em] text-[#03261A]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#03261A]" />
              BATTING
            </span>
          )}
          {!batting && (done || score.runs + score.balls + score.outs > 0) && (
            <span className="rounded bg-white/10 px-2 py-0.5 font-score text-[16px] font-bold tracking-wider text-[#FFD229]">
              {pad2(score.runs)} RUNS · {pad2(score.outs)} OUTS
            </span>
          )}
        </div>
        <div className="mt-1 truncate text-[15px] font-semibold uppercase leading-tight tracking-wide text-[#C8D2E1]">{team.name}</div>
      </div>
    </div>
  );
};

/** LIVE state: transparent canvas, compact bug top-left, scoreboard in the bottom band only. */
export const LiveScreen: React.FC<{ state: MatchSnapshot }> = ({ state }) => {
  const score = state.scores[state.battingTeam];

  return (
    <div className="absolute inset-0 font-display text-white">
      {/* Top-left event bug */}
      <div className="absolute left-[16px] top-[16px] flex items-center gap-4 rounded-2xl border border-white/10 bg-[#061B3A]/85 py-3 pl-3 pr-6 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
        <SafeImage src={EVENT.logo} alt="Belihuloya XVI" fallbackText="XVI" className="h-[72px] w-[72px] object-contain" />
        <div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded bg-[#E32636] px-2.5 py-0.5 text-[15px] font-black tracking-[0.2em]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              LIVE
            </span>
            <span className="text-[24px] font-black tracking-wider">{EVENT.title}</span>
          </div>
          <div className="mt-1 text-[15px] font-semibold tracking-wide text-[#C8D2E1]">{EVENT.venue}</div>
        </div>
      </div>

      {/* Bottom scoreboard: slim full-width lower third (1808×124, 12px from the bottom edge). */}
      <div className="absolute bottom-[12px] left-[56px] right-[56px] overflow-hidden rounded-[12px] border border-white/10 shadow-[0_-4px_28px_rgba(0,0,0,0.35)]">
        <div className="relative flex h-[94px] items-stretch bg-gradient-to-b from-[#0A2A55]/95 to-[#061B3A]/95">
          <div className="absolute inset-x-0 top-0 flex h-[3px]">
            <div className="flex-1 bg-[#17C978]" />
            <div className="flex-1 bg-[#FFD229]" />
            <div className="flex-1 bg-[#E32636]" />
            <div className="flex-1 bg-[#00D9F5]" />
          </div>

          <TeamBlock state={state} side="teamA" />

          <div className="flex shrink-0 items-stretch border-x border-white/10 bg-[#031430]/70">
            {(
              [
                ['RUNS', score.runs, 'text-white', 'text-[#00D9F5]'],
                ['BALLS', score.balls, 'text-[#17C978]', 'text-[#17C978]'],
                ['OUTS', score.outs, 'text-[#FF4655]', 'text-[#FF4655]'],
              ] as const
            ).map(([label, value, valueClass, labelClass], i) => (
              <div key={label} className={`flex w-[140px] flex-col items-center justify-center ${i ? 'border-l border-white/10' : ''}`}>
                <span className={`text-[13px] font-extrabold tracking-[0.28em] ${labelClass}`}>{label}</span>
                <StatValue value={value} className={`mt-0.5 text-[58px] ${valueClass}`} />
              </div>
            ))}
          </div>

          <TeamBlock state={state} side="teamB" />
        </div>

        <div className="flex h-[30px] items-center justify-between bg-white px-6 text-[#061B3A]">
          <span className="text-[14px] font-black tracking-[0.3em]">{EVENT.fullTitle}</span>
          <span className="text-[14px] font-bold tracking-wider text-[#0B2B55]">
            {EVENT.venue} · {EVENT.city}
          </span>
          <span className="font-script text-[22px] font-bold leading-none text-[#0B2B55]">More Than a Game</span>
        </div>
      </div>
    </div>
  );
};
