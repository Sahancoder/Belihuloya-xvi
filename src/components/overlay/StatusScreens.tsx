import React from 'react';
import { Trophy } from 'lucide-react';
import { MatchSnapshot, TeamSide } from '../../types/match';
import { EVENT } from '../../data/event';
import { getMatchResult, pad2 } from '../../services/result';
import { SafeImage } from '../common/SafeImage';
import { TeamLogo } from '../common/TeamLogo';
import { BrandBackdrop, VenueLine } from './BrandBackdrop';

const EventHeader: React.FC<{ logoSize: number }> = ({ logoSize }) => (
  <div className="flex items-center gap-8">
    <SafeImage src={EVENT.logo} alt="" fallbackText="XVI" className="object-contain" style={{ width: logoSize, height: logoSize }} />
    <div>
      <div className="text-[64px] font-black leading-none tracking-wide">{EVENT.title}</div>
      <div className="mt-3 text-[32px] font-semibold tracking-[0.18em] text-[#C8D2E1]">{EVENT.subtitle}</div>
    </div>
  </div>
);

/** READY: tournament waiting screen with the upcoming match. */
export const ReadyScreen: React.FC<{ state: MatchSnapshot }> = ({ state }) => (
  <BrandBackdrop>
    <div className="absolute inset-0 flex flex-col items-center pt-[110px]">
      <EventHeader logoSize={190} />

      <div className="mt-[70px] font-score text-[46px] font-bold tracking-[0.4em] text-[#00D9F5]">
        MATCH {pad2(state.matchNumber)} · STARTING SOON
      </div>

      <div className="anim-slide-up mt-10 flex items-center gap-20">
        {(['teamA', 'teamB'] as const).map((side, i) => (
          <React.Fragment key={side}>
            {i === 1 && <div className="font-score text-[110px] font-extrabold italic text-[#FFD229]">VS</div>}
            <div className="flex w-[560px] flex-col items-center text-center">
              <TeamLogo team={state[side]} size={250} className="ring-8 ring-white/10" />
              <div className="mt-6 font-score text-[92px] font-extrabold leading-none">{state[side].code}</div>
              <div className="mt-2 text-[27px] font-semibold leading-tight text-[#C8D2E1]">{state[side].name}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <VenueLine className="mt-12" />
    </div>
  </BrandBackdrop>
);

const ResultCard: React.FC<{ state: MatchSnapshot; side: TeamSide; winner: boolean }> = ({ state, side, winner }) => {
  const team = state[side];
  const score = state.scores[side];
  return (
    <div
      className={`relative flex w-[560px] flex-col items-center rounded-[32px] border-2 px-8 pb-8 pt-10 text-center ${
        winner ? 'border-[#FFD229] bg-[#0B2B55]/90 shadow-[0_0_80px_rgba(255,210,41,0.25)]' : 'border-white/10 bg-[#061B3A]/80'
      }`}
    >
      {winner && (
        <div className="absolute -top-6 rounded-full bg-[#FFD229] px-7 py-2 text-[24px] font-black tracking-[0.3em] text-[#061B3A]">WINNER</div>
      )}
      <TeamLogo team={team} size={150} />
      <div className="mt-4 font-score text-[68px] font-extrabold leading-none">{team.code}</div>
      <div className="mt-1 flex h-[56px] items-center text-[21px] font-semibold leading-tight text-[#C8D2E1]"><span className="line-clamp-2">{team.name}</span></div>
      <div className="mt-3 flex items-baseline gap-4">
        <span className="font-score text-[130px] font-extrabold leading-none text-white">{pad2(score.runs)}</span>
        <span className="font-score text-[34px] font-bold tracking-[0.2em] text-[#00D9F5]">RUNS</span>
      </div>
      <div className="mt-2 flex gap-10 font-score text-[30px] font-bold tracking-wider">
        <span className="text-[#17C978]">{pad2(score.balls)} BALLS</span>
        <span className="text-[#FF4655]">{pad2(score.outs)} OUTS</span>
      </div>
    </div>
  );
};

/** FINISHED: final result screen. */
export const FinishedScreen: React.FC<{ state: MatchSnapshot }> = ({ state }) => {
  const result = getMatchResult(state);
  return (
    <BrandBackdrop>
      <div className="absolute inset-0 flex flex-col items-center pt-[70px]">
        <EventHeader logoSize={130} />
        <div className="mt-8 font-score text-[52px] font-bold tracking-[0.45em] text-[#00D9F5]">MATCH CONCLUDED</div>

        <div className="anim-slide-up mt-12 flex items-center gap-8">
          <ResultCard state={state} side="teamA" winner={result.winner === 'teamA'} />
          <div className="flex w-[440px] flex-col items-center text-center">
            <Trophy className="h-20 w-20 text-[#FFD229]" />
            <div
              className="mt-4 font-score font-extrabold italic leading-none text-[#FFD229]"
              style={{ fontSize: result.headline.length > 9 ? 76 : 92 }}
            >
              {result.headline}
            </div>
            <div className="mt-3 text-[26px] font-semibold text-[#C8D2E1]">{result.detail}</div>
          </div>
          <ResultCard state={state} side="teamB" winner={result.winner === 'teamB'} />
        </div>
      </div>
    </BrandBackdrop>
  );
};
