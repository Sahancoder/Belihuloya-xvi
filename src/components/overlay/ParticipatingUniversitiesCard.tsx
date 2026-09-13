import React from 'react';
import { GraduationCap } from 'lucide-react';

interface ParticipatingUniversitiesCardProps {
  currentTeamACode?: string;
  currentTeamBCode?: string;
}

export const ParticipatingUniversitiesCard: React.FC<ParticipatingUniversitiesCardProps> = ({
  currentTeamACode,
  currentTeamBCode,
}) => {
  const rows = [
    ['SUSL', 'UOC', 'UOP', 'USJ', 'UOK'],
    ['UOM', 'UOJ', 'UOR', 'EUSL', 'SEUSL'],
    ['RUSL', 'WUSL', 'UWU', 'OUSL', 'UVPA'],
  ];

  return (
    <div className="bg-[#081533]/90 backdrop-blur-md border-2 border-cyan-400/80 rounded-2xl p-3 shadow-[0_0_20px_rgba(0,240,255,0.35)] select-none max-w-[290px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-cyan-500/30">
        <div className="p-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
          <GraduationCap className="w-4 h-4" />
        </div>
        <span className="text-xs font-black text-emerald-400 tracking-wide">
          Participating Universities
        </span>
      </div>

      {/* Grid of Universities */}
      <div className="space-y-1 font-mono text-[11px] font-bold">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-slate-200 px-1"
          >
            {row.map((code, colIdx) => {
              const isPlaying =
                code === currentTeamACode || code === currentTeamBCode;
              return (
                <React.Fragment key={code}>
                  <span
                    className={`transition-colors ${
                      isPlaying
                        ? 'text-yellow-300 font-black drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    {code}
                  </span>
                  {colIdx < row.length - 1 && (
                    <span className="text-cyan-500/50 font-normal">|</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
