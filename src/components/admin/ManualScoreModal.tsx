import React, { useState } from 'react';
import { ScoreState } from '../../types/match';
import { Edit3, AlertCircle } from 'lucide-react';

interface ManualScoreModalProps {
  isOpen: boolean;
  currentScore: ScoreState;
  onSave: (runs: number, balls: number, outs: number) => void;
  onClose: () => void;
}

export const ManualScoreModal: React.FC<ManualScoreModalProps> = ({
  isOpen,
  currentScore,
  onSave,
  onClose,
}) => {
  const [runs, setRuns] = useState(currentScore.runs);
  const [balls, setBalls] = useState(currentScore.balls);
  const [outs, setOuts] = useState(currentScore.outs);
  const [showLargeDiffWarning, setShowLargeDiffWarning] = useState(false);

  if (!isOpen) return null;

  const runDiff = Math.abs(runs - currentScore.runs);
  const isLargeDiff = runDiff >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLargeDiff && !showLargeDiffWarning) {
      setShowLargeDiffWarning(true);
      return;
    }
    onSave(runs, balls, outs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-broadcast-card border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Manual Score Override</h3>
            <span className="text-xs text-slate-400">Emergency scoring correction</span>
          </div>
        </div>

        {showLargeDiffWarning && (
          <div className="p-3 bg-amber-950/80 border border-amber-500/50 rounded-xl flex items-start gap-2.5 text-amber-300 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <strong className="block font-bold">Large Score Difference Detected!</strong>
              You are changing runs from <strong>{currentScore.runs}</strong> to <strong>{runs}</strong> (difference of {runDiff} runs). Click "Apply Override" again to confirm.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-cyan-400 uppercase mb-1">
                Runs
              </label>
              <input
                type="number"
                min="0"
                value={runs}
                onChange={(e) => {
                  setRuns(Math.max(0, parseInt(e.target.value) || 0));
                  setShowLargeDiffWarning(false);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-lg text-center font-bold focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
                Balls
              </label>
              <input
                type="number"
                min="0"
                value={balls}
                onChange={(e) => {
                  setBalls(Math.max(0, parseInt(e.target.value) || 0));
                  setShowLargeDiffWarning(false);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-lg text-center font-bold focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-red-400 uppercase mb-1">
                Outs
              </label>
              <input
                type="number"
                min="0"
                value={outs}
                onChange={(e) => {
                  setOuts(Math.max(0, parseInt(e.target.value) || 0));
                  setShowLargeDiffWarning(false);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-lg text-center font-bold focus:outline-none focus:border-red-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition shadow-cyan-glow"
            >
              {showLargeDiffWarning ? 'Confirm & Apply' : 'Save Override'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
