import React from 'react';
import { ArrowLeftRight, Gauge, Lock, Pencil, RotateCcw, Undo2 } from 'lucide-react';
import { TeamSide } from '../../types/match';
import { useMatchStore } from '../../store/matchStore';
import { pad2 } from '../../services/result';
import { TeamLogo } from '../common/TeamLogo';

interface ScorePanelProps {
  onOverride: () => void;
  onReset: () => void;
}

const BattingCard: React.FC<{ side: TeamSide }> = ({ side }) => {
  const team = useMatchStore((s) => s[side]);
  const batting = useMatchStore((s) => s.battingTeam === side);
  const done = useMatchStore((s) => s.turnDone[side]);
  const score = useMatchStore((s) => s.scores[side]);
  const setBattingTeam = useMatchStore((s) => s.setBattingTeam);

  return (
    <button
      type="button"
      onClick={() => setBattingTeam(side)}
      aria-pressed={batting}
      className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl border p-3 text-left transition ${
        side === 'teamB' ? 'flex-row-reverse text-right' : ''
      } ${batting ? 'border-ops-green bg-ops-green/[0.08] shadow-[0_0_0_3px_rgba(16,201,129,0.12)]' : 'border-white/10 bg-ops-inset hover:border-white/25'}`}
    >
      <TeamLogo team={team} size={54} />
      <div className="min-w-0 flex-1">
        <div className={`flex items-center gap-2 ${side === 'teamB' ? 'justify-end' : ''}`}>
          <span className="font-score text-[28px] font-bold leading-none text-white">{team.code}</span>
          {batting ? (
            <span className="rounded bg-ops-green px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider text-[#032A1C]">BATTING NOW</span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-ops-dim">Tap to bat</span>
          )}
        </div>
        <div className="line-clamp-2 text-[12px] leading-tight text-ops-muted" title={team.name}>{team.name}</div>
        <div className={`mt-0.5 flex items-center gap-1.5 font-score text-[14px] font-semibold tracking-wide text-ops-muted ${side === 'teamB' ? 'justify-end' : ''}`}>
          {done && <Lock className="h-3 w-3 text-ops-gold" aria-label="Turn ended" />}
          {pad2(score.runs)}R · {pad2(score.balls)}B · {pad2(score.outs)}O
        </div>
      </div>
    </button>
  );
};

const StatCard: React.FC<{ label: string; si: string; value: number; tone: 'cyan' | 'green' | 'red' }> = ({ label, si, value, tone }) => {
  const styles = {
    cyan: 'border-ops-cyan/50 from-ops-cyan/[0.12] text-ops-cyan',
    green: 'border-ops-green/50 from-ops-green/[0.12] text-ops-green',
    red: 'border-ops-red/50 from-ops-red/[0.14] text-ops-red',
  }[tone];
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border bg-gradient-to-b to-transparent py-2.5 ${styles}`}>
      <div className="flex items-baseline gap-2">
        <span className="text-[14px] font-extrabold tracking-[0.2em]">{label}</span>
        <span className="text-[12px] font-semibold opacity-70">{si}</span>
      </div>
      <span
        key={value}
        aria-live="polite"
        className={`anim-bump font-score text-[clamp(56px,6.2vh,92px)] font-extrabold leading-[1.05] tabular-nums ${tone === 'red' ? 'text-ops-red' : 'text-white'}`}
      >
        {pad2(value)}
      </span>
    </div>
  );
};

const SectionLabel: React.FC<{ color: string; label: string; keys: string }> = ({ color, label, keys }) => (
  <div className="mb-1.5 flex items-center justify-between">
    <span className={`text-[12px] font-extrabold uppercase tracking-[0.14em] ${color}`}>{label}</span>
    <span className="text-[11px] text-ops-dim">
      Key <span className="kbd">{keys}</span>
    </span>
  </div>
);

export const ScorePanel: React.FC<ScorePanelProps> = ({ onOverride, onReset }) => {
  const battingTeam = useMatchStore((s) => s.battingTeam);
  const team = useMatchStore((s) => s[s.battingTeam]);
  const score = useMatchStore((s) => s.scores[s.battingTeam]);
  const locked = useMatchStore((s) => s.turnDone[s.battingTeam]);
  const historyCount = useMatchStore((s) => s.history.length);
  const lastAction = useMatchStore((s) => s.history[0]?.description);
  const store = useMatchStore.getState;

  const runBtn =
    'btn h-[clamp(48px,5.6vh,64px)] rounded-xl border border-ops-cyan/40 bg-gradient-to-b from-[#0B5C86] to-[#08476A] font-score text-[26px] text-white hover:from-[#0E6E9F] hover:to-[#0A577F]';
  const minusBtn = 'btn-ghost h-[clamp(48px,5.6vh,64px)] font-score text-[22px]';

  return (
    <section aria-label="Live score control" className="panel flex flex-col p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="panel-title">
          <Gauge className="h-4 w-4 text-ops-cyan" />
          2. Live Score Control
        </h2>
        <div className="flex gap-2">
          <button type="button" onClick={onOverride} className="btn-ghost h-8 px-3 text-[11px]">
            <Pencil className="h-3.5 w-3.5 text-ops-cyan" />
            Manual Override
          </button>
          <button type="button" onClick={onReset} className="btn h-8 border border-ops-red/40 bg-ops-red/10 px-3 text-[11px] text-[#FF7A84] hover:bg-ops-red/20">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Match
          </button>
        </div>
      </div>

      {/* Current batting team */}
      <div className="flex items-stretch gap-2">
        <BattingCard side="teamA" />
        <button
          type="button"
          onClick={() => store().switchBattingTeam()}
          title="Switch batting team"
          aria-label="Switch batting team"
          className="btn-ghost w-12 shrink-0 flex-col gap-1 px-0 text-[9px]"
        >
          <ArrowLeftRight className="h-5 w-5 text-ops-cyan" />
          Switch
        </button>
        <BattingCard side="teamB" />
      </div>

      {locked && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-ops-gold/40 bg-ops-gold/10 px-3 py-2 text-[12px] font-semibold text-ops-gold">
          <Lock className="h-4 w-4 shrink-0" />
          {team.code} turn has ended — score is locked. Undo to reopen, or use Manual Override to correct it.
        </div>
      )}

      {/* Big numbers for the batting team */}
      <div className="mt-3 grid grid-cols-3 gap-3" aria-label={`${team.code} score`}>
        <StatCard label="RUNS" si="ලකුණු" value={score.runs} tone="cyan" />
        <StatCard label="BALLS" si="පන්දු" value={score.balls} tone="green" />
        <StatCard label="OUTS" si="දැවීම්" value={score.outs} tone="red" />
      </div>

      <fieldset disabled={locked} className="contents">
        <div className="mt-4">
          <SectionLabel color="text-ops-cyan" label={`Run Controls · ${team.code}`} keys="1 – 5" />
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => store().addRuns(n)} className={runBtn} aria-label={`Add ${n} runs`}>
                +{n}
              </button>
            ))}
            <button type="button" onClick={() => store().removeRun()} disabled={score.runs === 0} className={minusBtn} aria-label="Remove 1 run">
              −1
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <SectionLabel color="text-ops-green" label="Ball Controls" keys="B" />
            <div className="grid grid-cols-[1.6fr_1fr] gap-2">
              <button
                type="button"
                onClick={() => store().addBall()}
                className="btn h-[clamp(48px,5.6vh,64px)] border border-ops-green/50 bg-gradient-to-b from-[#0F9A64] to-[#0B7A4F] text-[17px] text-white hover:from-[#12B173] hover:to-[#0E8C5B]"
              >
                +1 Ball
              </button>
              <button type="button" onClick={() => store().removeBall()} disabled={score.balls === 0} className={`${minusBtn} text-[15px]`}>
                −1 Ball
              </button>
            </div>
          </div>
          <div>
            <SectionLabel color="text-ops-red" label="Out Controls" keys="O" />
            <div className="grid grid-cols-[1.6fr_1fr] gap-2">
              <button
                type="button"
                onClick={() => store().addOut()}
                className="btn h-[clamp(48px,5.6vh,64px)] border border-ops-red/60 bg-gradient-to-b from-[#D42A37] to-[#A81F2A] text-[17px] text-white hover:from-[#EF3340] hover:to-[#C02531]"
              >
                +1 Out
              </button>
              <button type="button" onClick={() => store().removeOut()} disabled={score.outs === 0} className={`${minusBtn} text-[15px]`}>
                −1 Out
              </button>
            </div>
          </div>
        </div>
      </fieldset>

      <div className="mt-3 flex items-center gap-3 border-t border-white/[0.07] pt-3">
        <button
          type="button"
          onClick={() => store().undoLastAction()}
          disabled={historyCount === 0}
          className="btn h-12 shrink-0 bg-ops-orange px-5 text-[14px] text-[#2A1703] hover:bg-[#FFB02E]"
        >
          <Undo2 className="h-5 w-5" />
          Undo Last Action
          <span className="kbd border-black/20 bg-black/10 text-[#2A1703]">U</span>
        </button>
        <div className="min-w-0 text-[12px] text-ops-dim">
          {lastAction ? (
            <>
              Last: <span className="font-semibold text-ops-muted">{lastAction}</span>
            </>
          ) : (
            <>Batting: {battingTeam === 'teamA' ? 'Team A' : 'Team B'} · no actions yet</>
          )}
        </div>
      </div>
    </section>
  );
};
