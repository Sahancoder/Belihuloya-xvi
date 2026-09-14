import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeftRight, Search, Users } from 'lucide-react';
import { TeamSide } from '../../types/match';
import { University } from '../../types/university';
import { UNIVERSITIES } from '../../data/universities';
import { useMatchStore } from '../../store/matchStore';
import { TeamLogo } from '../common/TeamLogo';

interface TeamSelectPanelProps {
  activeSlot: TeamSide;
  onActiveSlot: (side: TeamSide) => void;
  highlight: boolean;
}

export const TeamSelectPanel: React.FC<TeamSelectPanelProps> = ({ activeSlot, onActiveSlot, highlight }) => {
  const teamA = useMatchStore((s) => s.teamA);
  const teamB = useMatchStore((s) => s.teamB);
  const battingTeam = useMatchStore((s) => s.battingTeam);
  const setTeam = useMatchStore((s) => s.setTeam);
  const swapTeams = useMatchStore((s) => s.swapTeams);

  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return UNIVERSITIES;
    return UNIVERSITIES.filter((u) => u.code.toLowerCase().includes(q) || u.name.toLowerCase().includes(q));
  }, [query]);

  const choose = (u: University) => {
    const other = activeSlot === 'teamA' ? teamB : teamA;
    if (other.id === u.id) {
      setError(`${u.code} is already Team ${activeSlot === 'teamA' ? 'B' : 'A'}. Pick a different university or use Swap.`);
      return;
    }
    setError(null);
    setTeam(activeSlot, u);
    if (activeSlot === 'teamA') onActiveSlot('teamB');
  };

  const Slot: React.FC<{ side: TeamSide; team: University }> = ({ side, team }) => {
    const active = activeSlot === side;
    return (
      <button
        type="button"
        onClick={() => onActiveSlot(side)}
        aria-pressed={active}
        className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
          active ? 'border-ops-cyan bg-ops-cyan/[0.07] shadow-[0_0_0_3px_rgba(0,207,232,0.12)]' : 'border-white/10 bg-ops-inset hover:border-white/25'
        }`}
      >
        <TeamLogo team={team} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-extrabold uppercase tracking-[0.18em] ${active ? 'text-ops-cyan' : 'text-ops-dim'}`}>
              Team {side === 'teamA' ? 'A' : 'B'}
            </span>
            {battingTeam === side && (
              <span className="rounded bg-ops-green/15 px-1.5 py-px text-[9px] font-extrabold tracking-wider text-ops-green">BATTING</span>
            )}
          </div>
          <div className="font-score text-[26px] font-bold leading-none text-white">{team.code}</div>
          <div className="line-clamp-2 text-[12px] leading-tight text-ops-muted">{team.name}</div>
        </div>
        <span className={`text-[10px] font-bold uppercase ${active ? 'text-ops-cyan' : 'text-transparent group-hover:text-ops-dim'}`}>
          {active ? 'Selecting' : 'Change'}
        </span>
      </button>
    );
  };

  return (
    <section
      aria-label="Select teams"
      className={`panel flex min-h-0 flex-col transition-shadow ${highlight ? 'shadow-[0_0_0_2px_#00CFE8,0_0_40px_rgba(0,207,232,0.25)]' : ''}`}
    >
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <h2 className="panel-title">
          <Users className="h-4 w-4 text-ops-cyan" />
          1. Select Teams
        </h2>
        <button type="button" onClick={swapTeams} className="btn-ghost h-8 px-2.5 text-[11px]" title="Swap Team A and Team B (scores move with the teams)">
          <ArrowLeftRight className="h-3.5 w-3.5 text-ops-cyan" />
          Swap
        </button>
      </div>

      <div className="space-y-2 px-4">
        <Slot side="teamA" team={teamA} />
        <Slot side="teamB" team={teamB} />
        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-ops-red/40 bg-ops-red/10 p-2.5 text-[12px] font-semibold text-[#FF8A93]">
            <AlertTriangle className="mt-px h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] px-4 pt-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ops-dim">All Universities ({UNIVERSITIES.length})</span>
        <span className="text-[11px] font-semibold text-ops-cyan">→ Team {activeSlot === 'teamA' ? 'A' : 'B'}</span>
      </div>

      <div className="px-4 pt-2">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ops-dim" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && list.length === 1) choose(list[0]);
            }}
            placeholder="Search university…"
            aria-label="Search university"
            className="h-10 w-full rounded-xl border border-white/10 bg-ops-inset pl-9 pr-3 text-sm text-white placeholder:text-ops-dim focus:border-ops-cyan focus:outline-none"
          />
        </label>
      </div>

      <ul className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {list.map((u) => {
          const tag = u.id === teamA.id ? 'A' : u.id === teamB.id ? 'B' : null;
          return (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => choose(u)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-white/5 ${tag ? 'bg-white/[0.03]' : ''}`}
              >
                <TeamLogo team={u} size={30} />
                <span className="w-12 shrink-0 font-score text-[16px] font-bold text-white">{u.code}</span>
                <span className="min-w-0 flex-1 text-[12px] leading-tight text-ops-muted">{u.name}</span>
                {tag && (
                  <span className="rounded-md bg-ops-cyan/15 px-1.5 py-0.5 text-[10px] font-extrabold text-ops-cyan">TEAM {tag}</span>
                )}
              </button>
            </li>
          );
        })}
        {list.length === 0 && <li className="px-2 py-6 text-center text-xs text-ops-dim">No university matches “{query}”.</li>}
      </ul>
    </section>
  );
};
