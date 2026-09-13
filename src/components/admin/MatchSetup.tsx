import React, { useState } from 'react';
import { UNIVERSITIES, getUniversityById } from '../../data/universities';
import { SafeImage } from '../common/SafeImage';
import { useMatchStore } from '../../store/matchStore';
import { ConfirmModal } from './ConfirmModal';
import { Play, ArrowRightLeft } from 'lucide-react';

export const MatchSetup: React.FC = () => {
  const { teamA, teamB, battingTeam, setTeams, setBattingTeam, setStatus } = useMatchStore();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isSameTeam = teamA.id === teamB.id;

  const handleSelectTeamA = (newId: string) => {
    const newTeamA = getUniversityById(newId);
    setTeams(newTeamA, teamB);
  };

  const handleSelectTeamB = (newId: string) => {
    const newTeamB = getUniversityById(newId);
    setTeams(teamA, newTeamB);
  };

  const handleSwapTeams = () => {
    setTeams(teamB, teamA);
  };

  const handleStartMatch = () => {
    setStatus('LIVE');
    setShowConfirmModal(false);
  };

  return (
    <div className="bg-[#091426] border border-[#18CFF2]/20 rounded-2xl p-5 shadow-[0_8px_28px_rgba(0,0,0,0.20)] space-y-4 select-none font-display">
      {/* Header with Title and Auto-Update Live Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#18CFF2]" />
          <h2 className="font-extrabold text-sm tracking-wider text-white uppercase font-display">
            TEAMS SELECTION & SIDE CONTROL
          </h2>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#20D695]/15 border border-[#20D695]/40 text-[#20D695] text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#20D695] animate-pulse" />
            Auto-Updates Live
          </span>
        </div>

        <button
          type="button"
          onClick={handleSwapTeams}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#111D31] hover:bg-[#162742] text-xs font-semibold text-[#A7B2C7] hover:text-white rounded-lg border border-white/10 transition shadow-sm self-start sm:self-auto active:scale-[0.98]"
          title="Swap Team A and Team B (Instantly updates overlay)"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#18CFF2]" />
          <span>Swap Sides</span>
        </button>
      </div>

      {/* 2-Team Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Team A Selector */}
        <div className="bg-[#050B1B] border border-white/10 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#18CFF2] uppercase tracking-wider">
              TEAM A (HOME / SIDE 1)
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="battingTeamSetup"
                checked={battingTeam === 'teamA'}
                onChange={() => setBattingTeam('teamA')}
                className="accent-[#18CFF2]"
              />
              <span className={`text-[11px] font-semibold ${battingTeam === 'teamA' ? 'text-[#18CFF2]' : 'text-[#A7B2C7]'}`}>
                Batting {battingTeam === 'teamA' ? '(Active)' : ''}
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-full p-1.5 flex items-center justify-center shrink-0 border border-white/20">
              <SafeImage
                src={teamA.logoPath}
                alt={teamA.name}
                fallbackText={teamA.code}
                fallbackBg={teamA.primaryColor}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <select
                value={teamA.id}
                onChange={(e) => handleSelectTeamA(e.target.value)}
                className="w-full bg-[#111D31] border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-semibold focus:outline-none focus:border-[#18CFF2] transition cursor-pointer"
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u.id} value={u.id} className="bg-[#050B1B] text-white">
                    {u.code} - {u.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className="text-[#6F809B] truncate font-medium">
                  {teamA.shortName}
                </span>
                <span className="text-[#18CFF2] font-score font-bold">
                  {teamA.code}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Team B Selector */}
        <div className="bg-[#050B1B] border border-white/10 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#18CFF2] uppercase tracking-wider">
              TEAM B (AWAY / SIDE 2)
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="battingTeamSetup"
                checked={battingTeam === 'teamB'}
                onChange={() => setBattingTeam('teamB')}
                className="accent-[#18CFF2]"
              />
              <span className={`text-[11px] font-semibold ${battingTeam === 'teamB' ? 'text-[#18CFF2]' : 'text-[#A7B2C7]'}`}>
                Batting {battingTeam === 'teamB' ? '(Active)' : ''}
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-full p-1.5 flex items-center justify-center shrink-0 border border-white/20">
              <SafeImage
                src={teamB.logoPath}
                alt={teamB.name}
                fallbackText={teamB.code}
                fallbackBg={teamB.primaryColor}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <select
                value={teamB.id}
                onChange={(e) => handleSelectTeamB(e.target.value)}
                className="w-full bg-[#111D31] border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-semibold focus:outline-none focus:border-[#18CFF2] transition cursor-pointer"
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u.id} value={u.id} className="bg-[#050B1B] text-white">
                    {u.code} - {u.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className="text-[#6F809B] truncate font-medium">
                  {teamB.shortName}
                </span>
                <span className="text-[#18CFF2] font-score font-bold">
                  {teamB.code}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSameTeam && (
        <div className="p-2.5 bg-[#F43F4B]/15 border border-[#F43F4B]/40 rounded-xl text-xs text-[#F43F4B] font-semibold text-center">
          Warning: Team A and Team B cannot be the same university. Please select two distinct teams.
        </div>
      )}

      {/* Action Row */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-[#6F809B]">
          Teams auto-sync immediately to OBS overlay upon selection.
        </span>

        <button
          type="button"
          disabled={isSameTeam}
          onClick={() => setShowConfirmModal(true)}
          className="h-10 flex items-center gap-2 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#0A4D80] to-[#0C5D9B] hover:from-[#0C5D9B] hover:to-[#0A4D80] border border-[#18CFF2]/40 shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Launch / Go LIVE</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirm Match Start"
        message={`Launch live match: ${teamA.name} (${teamA.code}) vs ${teamB.name} (${teamB.code})? Active batting team: ${battingTeam === 'teamA' ? teamA.code : teamB.code}. Match status will be set to LIVE.`}
        confirmText="Confirm & Go LIVE"
        variant="primary"
        onConfirm={handleStartMatch}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
