import React, { useState } from 'react';
import { useMatchStore } from '../../store/matchStore';
import { ConfirmModal } from './ConfirmModal';
import { ArrowRightLeft, Flag } from 'lucide-react';

export const InningsControls: React.FC = () => {
  const {
    teamA,
    teamB,
    battingTeam,
    innings,
    score,
    teamAScore,
    teamBScore,
    switchBattingTeam,
    endInnings,
  } = useMatchStore();

  const [showEndInningsModal, setShowEndInningsModal] = useState(false);
  const [showSwitchBattingModal, setShowSwitchBattingModal] = useState(false);

  const activeTeam = battingTeam === 'teamA' ? teamA : teamB;
  const nextTeam = battingTeam === 'teamA' ? teamB : teamA;

  return (
    <div className="bg-[#091426] border border-[#18CFF2]/20 rounded-2xl p-5 shadow-[0_8px_28px_rgba(0,0,0,0.20)] space-y-4 select-none font-display">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-[#F59E0B]" />
          <h3 className="font-extrabold text-sm tracking-wider text-white uppercase font-display">
            INNINGS & SIDE CONTROL (INNINGS {innings})
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-score tracking-wider">
          <span className="text-[#A7B2C7]">
            {teamA.code}: <strong className="text-white text-sm">{teamAScore.runs}R</strong>
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#A7B2C7]">
            {teamB.code}: <strong className="text-white text-sm">{teamBScore.runs}R</strong>
          </span>
        </div>
      </div>

      {/* Buttons Row (48px Height, 14px Gap) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Switch Batting Team Button */}
        <button
          type="button"
          onClick={() => setShowSwitchBattingModal(true)}
          className="h-12 flex items-center justify-center gap-2 px-4 rounded-xl bg-[#111D31] hover:bg-[#162742] text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition active:scale-[0.98] shadow-sm"
        >
          <ArrowRightLeft className="w-4 h-4 text-[#18CFF2]" />
          <span>Switch Batting ({nextTeam.code})</span>
        </button>

        {/* End Innings Button */}
        <button
          type="button"
          onClick={() => setShowEndInningsModal(true)}
          className="h-12 flex items-center justify-center gap-2 px-4 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#F59E0B] hover:to-[#D97706] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition active:scale-[0.98]"
        >
          <Flag className="w-4 h-4 fill-white" />
          <span>End Current Innings</span>
        </button>
      </div>

      {/* Switch Batting Confirmation */}
      <ConfirmModal
        isOpen={showSwitchBattingModal}
        title="Switch Batting Team"
        message={`Switch batting team from ${activeTeam.code} to ${nextTeam.code}? The scoreboard will immediately show ${nextTeam.code} as the batting team.`}
        confirmText="Confirm Switch"
        variant="warning"
        onConfirm={() => {
          switchBattingTeam();
          setShowSwitchBattingModal(false);
        }}
        onCancel={() => setShowSwitchBattingModal(false)}
      />

      {/* End Innings Confirmation Modal */}
      <ConfirmModal
        isOpen={showEndInningsModal}
        title={`Confirm End of Innings ${innings}`}
        message={`End current innings for ${activeTeam.name} (${activeTeam.code}) with final score: ${score.runs} Runs, ${score.balls} Balls, ${score.outs} Outs? This will switch batting to ${nextTeam.code} and set status to INTERVAL.`}
        confirmText="Confirm End Innings"
        variant="warning"
        onConfirm={() => {
          endInnings();
          setShowEndInningsModal(false);
        }}
        onCancel={() => setShowEndInningsModal(false)}
      />
    </div>
  );
};
