import React, { useMemo, useState } from 'react';
import { History, Keyboard } from 'lucide-react';
import { useMatchStore } from '../../store/matchStore';
import { loadArchive } from '../../services/persistence';
import { pad2 } from '../../services/result';

const TYPE_COLOR: Record<string, string> = {
  RUN: 'bg-ops-cyan',
  BALL: 'bg-ops-green',
  OUT: 'bg-ops-red',
  END_TURN: 'bg-ops-gold',
  STATUS: 'bg-white',
  OVERRIDE: 'bg-ops-orange',
};

export const ActivityPanel: React.FC = () => {
  const history = useMatchStore((s) => s.history);
  const matchId = useMatchStore((s) => s.matchId);
  const [tab, setTab] = useState<'activity' | 'log'>('activity');
  // Archive changes only when a new match starts (matchId changes).
  const archive = useMemo(() => loadArchive(), [matchId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section aria-label="Recent activity" className="panel flex min-h-[220px] flex-1 flex-col p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="panel-title">
          <History className="h-4 w-4 text-ops-cyan" />
          Recent Activity
        </h2>
        <div className="flex rounded-lg border border-white/10 bg-ops-inset p-0.5 text-[11px] font-bold">
          {(['activity', 'log'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-2.5 py-1 ${tab === t ? 'bg-white/10 text-white' : 'text-ops-dim hover:text-white'}`}
            >
              {t === 'activity' ? `This Match (${history.length})` : `Match Log (${archive.length})`}
            </button>
          ))}
        </div>
      </div>

      <ol className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {tab === 'activity' &&
          (history.length === 0 ? (
            <li className="py-8 text-center text-xs text-ops-dim">No actions yet. Every score change appears here and can be undone.</li>
          ) : (
            history.map((a, i) => (
              <li
                key={a.id}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] ${i === 0 ? 'bg-ops-cyan/[0.08] text-white' : 'text-ops-muted'}`}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${TYPE_COLOR[a.type] ?? 'bg-ops-dim'}`} />
                <span className="min-w-0 flex-1 truncate font-medium">{a.description}</span>
                <span className="shrink-0 font-score text-[12px] tabular-nums text-ops-dim">
                  {new Date(a.timestamp).toLocaleTimeString('en-GB', { hour12: false })}
                </span>
              </li>
            ))
          ))}

        {tab === 'log' &&
          (archive.length === 0 ? (
            <li className="py-8 text-center text-xs text-ops-dim">Finished matches are saved here when you press New Match.</li>
          ) : (
            archive.map((m) => (
              <li key={m.matchId} className="flex items-center gap-2 rounded-lg bg-ops-inset px-2.5 py-2 text-[12px]">
                <span className="font-score font-bold text-ops-dim">#{pad2(m.matchNumber)}</span>
                <span className="min-w-0 flex-1 truncate font-score text-[14px] font-semibold text-white">
                  {m.teamA} {m.scores.teamA.runs} – {m.scores.teamB.runs} {m.teamB}
                </span>
                <span className="shrink-0 text-[11px] font-bold text-ops-gold">{m.result}</span>
              </li>
            ))
          ))}
      </ol>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/[0.07] pt-2 text-[11px] text-ops-dim">
        <Keyboard className="h-3.5 w-3.5" />
        <span><span className="kbd">1</span>–<span className="kbd">5</span> runs</span>
        <span><span className="kbd">B</span> ball</span>
        <span><span className="kbd">O</span> out</span>
        <span><span className="kbd">U</span> undo</span>
      </div>
    </section>
  );
};
