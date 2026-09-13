import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import { Undo2, History } from 'lucide-react';

export const RecentActions: React.FC = () => {
  const { history, undoLastAction } = useMatchStore();

  const hasHistory = history.length > 0;

  return (
    <div className="bg-[#091426] border border-[#18CFF2]/20 rounded-2xl p-4 md:p-5 shadow-[0_8px_28px_rgba(0,0,0,0.20)] space-y-3 select-none font-display">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#18CFF2]" />
          <h3 className="font-extrabold text-sm tracking-wider text-white uppercase font-display">
            RECENT ACTIONS ({history.length})
          </h3>
        </div>

        <button
          type="button"
          onClick={undoLastAction}
          disabled={!hasHistory}
          className="h-8 flex items-center gap-1.5 px-3 bg-[#D97706] hover:bg-[#F59E0B] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-sm transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
          title="Undo Last Action (Shortcut: U)"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Undo Action (U)</span>
        </button>
      </div>

      {/* Action List (Max height ~260px, 6px gap, 36-40px height) */}
      <div className="max-h-[260px] overflow-y-auto space-y-1.5 pr-1">
        {!hasHistory ? (
          <div className="text-center py-6 text-[#6F809B] font-sans text-xs italic">
            No scoring actions recorded yet.
          </div>
        ) : (
          history.slice(0, 20).map((act, index) => (
            <div
              key={act.id}
              className={`flex items-center justify-between px-3 h-9 rounded-lg border transition text-xs ${
                index === 0
                  ? 'bg-[#18CFF2]/10 border-[#18CFF2]/40 text-[#F8FAFC]'
                  : 'bg-[#050B1B] border-white/5 text-[#A7B2C7]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="text-[11px] text-[#6F809B] font-mono font-bold shrink-0">
                  #{history.length - index}
                </span>
                <span className="font-medium truncate font-sans text-slate-200">
                  {act.description}
                </span>
              </div>
              <span className="text-[10px] text-[#6F809B] font-mono shrink-0">
                {new Date(act.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
