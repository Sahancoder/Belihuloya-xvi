import React, { useState } from 'react';
import { useMatchStore } from '../../store/matchStore';
import { ConfirmModal } from './ConfirmModal';
import { RotateCcw, AlertOctagon, Trash2 } from 'lucide-react';

export const ResetControls: React.FC = () => {
  const { resetScore, resetInnings, resetMatch } = useMatchStore();

  const [showResetScoreModal, setShowResetScoreModal] = useState(false);
  const [showResetInningsModal, setShowResetInningsModal] = useState(false);
  const [showResetMatchModal, setShowResetMatchModal] = useState(false);

  return (
    <div className="bg-[#091426] border border-[#F43F4B]/20 rounded-2xl p-5 shadow-[0_8px_28px_rgba(0,0,0,0.20)] space-y-3 select-none font-display">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <AlertOctagon className="w-4 h-4 text-[#F43F4B]" />
        <h3 className="font-extrabold text-sm tracking-wider text-[#F43F4B] uppercase font-display">
          SAFETY RESET ZONE (OPERATOR PROTECTION)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Reset Score */}
        <button
          type="button"
          onClick={() => setShowResetScoreModal(true)}
          className="h-10 px-3 rounded-xl bg-[#111D31] hover:bg-[#162742] text-[#A7B2C7] hover:text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Reset Score</span>
        </button>

        {/* Reset Innings */}
        <button
          type="button"
          onClick={() => setShowResetInningsModal(true)}
          className="h-10 px-3 rounded-xl bg-[#111D31] hover:bg-[#162742] text-[#A7B2C7] hover:text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Reset Innings</span>
        </button>

        {/* Reset Entire Match */}
        <button
          type="button"
          onClick={() => setShowResetMatchModal(true)}
          className="h-10 px-3 rounded-xl bg-[#F43F4B]/15 hover:bg-[#F43F4B]/25 text-[#FF5A61] font-extrabold text-xs uppercase tracking-wider border border-[#F43F4B]/40 shadow-sm transition flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <Trash2 className="w-3.5 h-3.5 text-[#F43F4B]" />
          <span>Reset Match</span>
        </button>
      </div>

      {/* Reset Score Modal */}
      <ConfirmModal
        isOpen={showResetScoreModal}
        title="Reset Current Batting Score?"
        message="This will reset the active runs, balls, and outs to 0 for the currently batting team. You can still undo this action."
        confirmText="Confirm Reset Score"
        variant="warning"
        onConfirm={() => {
          resetScore();
          setShowResetScoreModal(false);
        }}
        onCancel={() => setShowResetScoreModal(false)}
      />

      {/* Reset Innings Modal */}
      <ConfirmModal
        isOpen={showResetInningsModal}
        title="Reset Innings to 1?"
        message="This will reset the match to Innings 1 and zero all scores. You can still undo this action."
        confirmText="Confirm Reset Innings"
        variant="warning"
        onConfirm={() => {
          resetInnings();
          setShowResetInningsModal(false);
        }}
        onCancel={() => setShowResetInningsModal(false)}
      />

      {/* Reset Match Modal (Strong typed confirmation) */}
      <ConfirmModal
        isOpen={showResetMatchModal}
        title="DANGER: Reset Entire Match?"
        message="This will wipe all match scores, teams, innings, and clear the entire history log back to default initial state. Type RESET below to proceed."
        confirmText="RESET ENTIRE MATCH"
        variant="danger"
        requireInput="RESET"
        onConfirm={() => {
          resetMatch();
          setShowResetMatchModal(false);
        }}
        onCancel={() => setShowResetMatchModal(false)}
      />
    </div>
  );
};
