import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import { LiveBadge } from './LiveBadge';
import { ParticipatingUniversitiesCard } from './ParticipatingUniversitiesCard';
import { TournamentLogo } from './TournamentLogo';
import { TeamDisplay } from './TeamDisplay';
import { ScoreDisplay } from './ScoreDisplay';
import { TournamentBar } from './TournamentBar';
import { MatchSnapshot } from '../../types/match';

interface ScoreboardOverlayProps {
  overrideState?: MatchSnapshot;
  isScaledPreview?: boolean;
}

export const ScoreboardOverlay: React.FC<ScoreboardOverlayProps> = ({
  overrideState,
  isScaledPreview = false,
}) => {
  const store = useMatchStore();
  const state = overrideState || store;

  const {
    teamA,
    teamB,
    battingTeam,
    score,
    teamAScore,
    teamBScore,
    status,
    showUniversitiesCard,
  } = state;

  const runsA = teamAScore?.runs ?? 0;
  const outsA = teamAScore?.outs ?? 0;
  const runsB = teamBScore?.runs ?? 0;
  const outsB = teamBScore?.outs ?? 0;
  const pad = (n: number) => String(n).padStart(2, '0');

  const getMatchResult = () => {
    if (runsA > runsB) {
      const diff = runsA - runsB;
      return `${teamA.code} WON BY ${diff} RUN${diff > 1 ? 'S' : ''}`;
    } else if (runsB > runsA) {
      const diff = runsB - runsA;
      return `${teamB.code} WON BY ${diff} RUN${diff > 1 ? 'S' : ''}`;
    } else {
      return 'MATCH TIED';
    }
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between select-none overflow-hidden ${
        isScaledPreview ? 'bg-[#020D20]' : 'bg-transparent'
      }`}
      style={{
        aspectRatio: '16/9',
      }}
    >
      {/* 1. TOP SECTION (Safe Area Margins) */}
      <div className="flex items-start justify-between p-6 md:p-8 w-full z-20 pointer-events-none">
        {/* Top Left: Live Badge & Participating Universities Card (Only in PRE-MATCH / READY state) */}
        <div className="flex flex-col gap-3">
          <LiveBadge status={status} />
          {showUniversitiesCard && status === 'READY' && (
            <ParticipatingUniversitiesCard
              currentTeamACode={teamA.code}
              currentTeamBCode={teamB.code}
            />
          )}
        </div>

        {/* Top Right: Belihuloya XVI Logo */}
        <div>
          <TournamentLogo />
        </div>
      </div>

      {/* 2. CENTER AREA - Camera Unobstructed + Interval/Final Scorecard Banner */}
      <div className="flex-1 flex items-center justify-center pointer-events-none z-10">
        {status === 'INTERVAL' && (
          <div className="bg-[#061B3A]/95 backdrop-blur-md px-10 py-5 rounded-2xl border border-[#FFD229]/60 shadow-[0_4px_18px_rgba(0,0,0,0.28),0_0_20px_rgba(255,210,41,0.25)] text-center animate-pulse">
            <span className="text-2xl md:text-3xl font-black text-[#FFD229] tracking-widest uppercase block font-display">
              MATCH INTERVAL
            </span>
            <span className="text-xs md:text-sm font-semibold text-[#C8D2E1] tracking-wider uppercase font-display">
              WE WILL BE BACK SHORTLY
            </span>
          </div>
        )}

        {status === 'FINISHED' && (
          <div className="bg-[#061B3A]/95 backdrop-blur-md px-10 py-6 rounded-2xl border border-[#17C978]/60 shadow-[0_4px_18px_rgba(0,0,0,0.28),0_0_25px_rgba(23,201,120,0.25)] text-center">
            <span className="text-2xl md:text-3xl font-black text-[#17C978] tracking-widest uppercase block font-display">
              MATCH CONCLUDED
            </span>
            <div className="mt-2 text-lg md:text-xl font-score font-bold tracking-wider text-[#C8D2E1] flex items-center justify-center gap-3">
              <span>{teamA.code} {pad(runsA)}/{outsA}</span>
              <span className="text-white/40">•</span>
              <span>{teamB.code} {pad(runsB)}/{outsB}</span>
            </div>
            <div className="mt-2 text-base md:text-lg font-black text-white font-display tracking-wider uppercase">
              {getMatchResult()}
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM SECTION: Scoreboard Master Bar & Slogan */}
      <div className="w-full flex flex-col items-center justify-end z-20">
        {/* Main Floating Score Bar */}
        <div className="w-full max-w-[1780px] px-6 pb-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Team A (Left) */}
            <div className="flex-1 flex justify-start">
              <TeamDisplay
                team={teamA}
                isBatting={battingTeam === 'teamA'}
                align="left"
              />
            </div>

            {/* Central Score Capsule: RUNS | BALLS | OUTS */}
            <div className="shrink-0">
              <ScoreDisplay score={score} />
            </div>

            {/* Team B (Right) */}
            <div className="flex-1 flex justify-end">
              <TeamDisplay
                team={teamB}
                isBatting={battingTeam === 'teamB'}
                align="right"
              />
            </div>
          </div>
        </div>

        {/* Bottom Slogan Bar */}
        <TournamentBar />
      </div>
    </div>
  );
};
