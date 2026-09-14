import React from 'react';
import { Flag, PlusCircle, Trophy, Workflow } from 'lucide-react';
import { WinnerRule } from '../../types/match';
import { useMatchStore } from '../../store/matchStore';
import { getMatchResult } from '../../services/result';

interface MatchFlowPanelProps {
  onEndTurn: () => void;
  onFinish: () => void;
  onNewMatch: () => void;
}

export const MatchFlowPanel: React.FC<MatchFlowPanelProps> = ({ onEndTurn, onFinish, onNewMatch }) => {
  const state = useMatchStore();
  const batting = state[state.battingTeam];
  const locked = state.turnDone[state.battingTeam];
  const bothDone = state.turnDone.teamA && state.turnDone.teamB;
  const result = getMatchResult(state);

  const rules: { id: WinnerRule; label: string }[] = [
    { id: 'AUTO', label: 'Auto (most runs)' },
    { id: 'teamA', label: state.teamA.code },
    { id: 'teamB', label: state.teamB.code },
    { id: 'TIE', label: 'Tie' },
  ];

  return (
    <section aria-label="Turn and match control" className="panel p-4">
      <h2 className="panel-title mb-3">
        <Workflow className="h-4 w-4 text-ops-cyan" />
        3. Turn &amp; Match Control
      </h2>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onEndTurn}
          disabled={locked}
          className="btn h-14 flex-col gap-0.5 border border-ops-gold/50 bg-ops-gold/[0.12] text-[13px] text-ops-gold hover:bg-ops-gold/20"
        >
          <span className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            End Current Turn
          </span>
          <span className="text-[10px] font-semibold normal-case tracking-normal opacity-80">
            {locked ? `${batting.code} already ended` : `Lock ${batting.code} & switch`}
          </span>
        </button>

        <button
          type="button"
          onClick={onFinish}
          className={`btn h-14 flex-col gap-0.5 border text-[13px] ${
            bothDone ? 'border-white bg-white text-ops-bg hover:bg-white/90' : 'border-white/15 bg-ops-inset text-white hover:border-white/30'
          }`}
        >
          <span className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Finish Match
          </span>
          <span className="text-[10px] font-semibold normal-case tracking-normal opacity-70">{result.headline}</span>
        </button>

        <button type="button" onClick={onNewMatch} className="btn h-14 flex-col gap-0.5 border border-ops-cyan/40 bg-ops-cyan/10 text-[13px] text-ops-cyan hover:bg-ops-cyan/20">
          <span className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Match
          </span>
          <span className="text-[10px] font-semibold normal-case tracking-normal opacity-80">Save & set up next</span>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ops-dim">Winner rule</span>
        <div role="radiogroup" aria-label="Winner rule" className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-ops-inset p-0.5">
          {rules.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={state.winnerRule === r.id}
              onClick={() => state.setWinnerRule(r.id)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                state.winnerRule === r.id ? 'bg-white text-ops-bg' : 'text-ops-muted hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
