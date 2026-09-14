import React, { useState } from 'react';
import { AlertTriangle, Flag, Pencil, PlusCircle, Trophy } from 'lucide-react';
import { ScoreState, TeamSide } from '../../types/match';
import { otherSide, useMatchStore } from '../../store/matchStore';
import { getMatchResult, pad2 } from '../../services/result';
import { Modal } from './Modal';
import { TeamLogo } from '../common/TeamLogo';

const cancelBtn = 'btn-ghost h-10 px-4 text-[12px]';

const ScoreSummary: React.FC<{ score: ScoreState }> = ({ score }) => (
  <div className="grid grid-cols-3 gap-2 text-center">
    {(
      [
        ['Runs', score.runs, 'text-ops-cyan'],
        ['Balls', score.balls, 'text-ops-green'],
        ['Outs', score.outs, 'text-ops-red'],
      ] as const
    ).map(([label, value, color]) => (
      <div key={label} className="rounded-xl bg-ops-inset py-2">
        <div className={`text-[11px] font-extrabold uppercase tracking-widest ${color}`}>{label}</div>
        <div className="font-score text-[40px] font-bold leading-none text-white">{pad2(value)}</div>
      </div>
    ))}
  </div>
);

export const EndTurnDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const s = useMatchStore();
  const side = s.battingTeam;
  const next = otherSide(side);
  const nextAvailable = !s.turnDone[next];

  return (
    <Modal
      title={`End ${s[side].code} batting turn?`}
      subtitle="The score will be locked for this team."
      tone="gold"
      icon={<Flag className="mt-0.5 h-6 w-6 text-ops-gold" />}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            autoFocus
            className="btn h-10 bg-ops-gold px-5 text-[12px] text-[#2A1E03] hover:bg-[#FFD466]"
            onClick={() => {
              s.endTurn();
              onClose();
            }}
          >
            Confirm
          </button>
        </>
      }
    >
      <div className="mb-3 flex items-center gap-3">
        <TeamLogo team={s[side]} size={44} />
        <div className="text-sm font-semibold text-white">{s[side].name}</div>
      </div>
      <ScoreSummary score={s.scores[side]} />
      <p className="mt-3 text-[12px] text-ops-muted">
        {nextAvailable
          ? `Batting switches to ${s[next].code} automatically. Undo (U) reverses this.`
          : `${s[next].code} has already batted — both turns will be complete. Use Finish Match next.`}
      </p>
    </Modal>
  );
};

export const ResetDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const resetMatch = useMatchStore((s) => s.resetMatch);
  const [typed, setTyped] = useState('');
  const ok = typed.trim().toUpperCase() === 'RESET';

  return (
    <Modal
      title="Reset this match?"
      subtitle="All current scores will be cleared."
      tone="red"
      icon={<AlertTriangle className="mt-0.5 h-6 w-6 text-ops-red" />}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!ok}
            className="btn h-10 bg-ops-red px-5 text-[12px] text-white hover:bg-[#FF4A56]"
            onClick={() => {
              resetMatch();
              onClose();
            }}
          >
            Reset Match
          </button>
        </>
      }
    >
      <p className="text-[13px] text-ops-muted">
        Runs, balls, outs and turn locks for both teams go back to zero, status returns to READY and the undo history is cleared. Teams stay selected.
        <strong className="text-white"> This cannot be undone.</strong>
      </p>
      <label className="mt-4 block text-[12px] font-semibold text-ops-muted">
        Type <span className="font-score text-[15px] font-bold text-ops-red">RESET</span> to continue
        <input
          autoFocus
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && ok) {
              resetMatch();
              onClose();
            }
          }}
          className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-ops-inset px-3 font-score text-lg tracking-widest text-white focus:border-ops-red focus:outline-none"
          placeholder="RESET"
        />
      </label>
    </Modal>
  );
};

export const OverrideDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const s = useMatchStore();
  const [side, setSide] = useState<TeamSide>(s.battingTeam);
  const [draft, setDraft] = useState<Record<TeamSide, ScoreState>>({ teamA: { ...s.scores.teamA }, teamB: { ...s.scores.teamB } });

  const setField = (field: keyof ScoreState, raw: string) =>
    setDraft((d) => ({ ...d, [side]: { ...d[side], [field]: Math.max(0, Math.floor(Number(raw)) || 0) } }));

  const save = () => {
    s.manualOverride(side, draft[side]);
    onClose();
  };

  return (
    <Modal
      title="Manual score override"
      subtitle="Emergency only — use this to fix a score mismatch."
      tone="cyan"
      icon={<Pencil className="mt-0.5 h-6 w-6 text-ops-cyan" />}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn h-10 bg-ops-cyan px-5 text-[12px] text-[#03202A] hover:bg-[#3BE3F7]" onClick={save}>
            Save
          </button>
        </>
      }
    >
      <div className="mb-4 grid grid-cols-2 gap-2">
        {(['teamA', 'teamB'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSide(t)}
            aria-pressed={side === t}
            className={`flex items-center gap-2 rounded-xl border p-2 ${side === t ? 'border-ops-cyan bg-ops-cyan/10' : 'border-white/10 bg-ops-inset'}`}
          >
            <TeamLogo team={s[t]} size={30} />
            <span className="font-score text-lg font-bold text-white">{s[t].code}</span>
          </button>
        ))}
      </div>
      <form
        className="grid grid-cols-3 gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        {(
          [
            ['runs', 'Runs', 'text-ops-cyan'],
            ['balls', 'Balls', 'text-ops-green'],
            ['outs', 'Outs', 'text-ops-red'],
          ] as const
        ).map(([field, label, color]) => (
          <label key={field} className={`text-[11px] font-extrabold uppercase tracking-widest ${color}`}>
            {label}
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={draft[side][field]}
              onChange={(e) => setField(field, e.target.value)}
              onFocus={(e) => e.target.select()}
              className="mt-1 h-14 w-full rounded-xl border border-white/10 bg-ops-inset text-center font-score text-3xl font-bold text-white focus:border-ops-cyan focus:outline-none"
            />
          </label>
        ))}
        <button type="submit" className="hidden" />
      </form>
      <p className="mt-3 text-[11px] text-ops-dim">
        Current {s[side].code}: {s.scores[side].runs}R · {s.scores[side].balls}B · {s.scores[side].outs}O. The change is recorded and can be undone.
      </p>
    </Modal>
  );
};

export const FinishDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const s = useMatchStore();
  const result = getMatchResult(s);

  return (
    <Modal
      title="Finish match?"
      subtitle="OBS switches to the MATCH CONCLUDED screen."
      tone="green"
      icon={<Trophy className="mt-0.5 h-6 w-6 text-ops-gold" />}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            autoFocus
            className="btn h-10 bg-white px-5 text-[12px] text-ops-bg hover:bg-white/90"
            onClick={() => {
              s.setStatus('FINISHED');
              onClose();
            }}
          >
            Show Final Result
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {(['teamA', 'teamB'] as const).map((t) => (
          <div key={t} className={`rounded-xl border p-3 text-center ${result.winner === t ? 'border-ops-gold bg-ops-gold/10' : 'border-white/10 bg-ops-inset'}`}>
            <div className="flex justify-center">
              <TeamLogo team={s[t]} size={44} />
            </div>
            <div className="mt-1 font-score text-xl font-bold text-white">{s[t].code}</div>
            <div className="font-score text-4xl font-bold text-white">{pad2(s.scores[t].runs)}</div>
            <div className="text-[11px] text-ops-muted">
              {s.scores[t].balls} balls · {s.scores[t].outs} outs
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-center">
        <div className="font-score text-3xl font-bold text-ops-gold">{result.headline}</div>
        <div className="text-[12px] text-ops-muted">
          {result.detail} · rule: {s.winnerRule === 'AUTO' ? 'most runs' : 'manual'}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-1">
        {(
          [
            ['AUTO', 'Auto'],
            ['teamA', `${s.teamA.code} wins`],
            ['teamB', `${s.teamB.code} wins`],
            ['TIE', 'Tie'],
          ] as const
        ).map(([rule, label]) => (
          <button
            key={rule}
            type="button"
            onClick={() => s.setWinnerRule(rule)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${s.winnerRule === rule ? 'bg-white text-ops-bg' : 'bg-ops-inset text-ops-muted hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </Modal>
  );
};

export const NewMatchDialog: React.FC<{ onClose: () => void; onDone: () => void }> = ({ onClose, onDone }) => {
  const s = useMatchStore();
  const result = getMatchResult(s);

  return (
    <Modal
      title="Start a new match?"
      tone="cyan"
      icon={<PlusCircle className="mt-0.5 h-6 w-6 text-ops-cyan" />}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            autoFocus
            className="btn h-10 bg-ops-cyan px-5 text-[12px] text-[#03202A] hover:bg-[#3BE3F7]"
            onClick={() => {
              s.newMatch();
              onClose();
              onDone();
            }}
          >
            Save &amp; New Match
          </button>
        </>
      }
    >
      <div className="rounded-xl bg-ops-inset p-3 text-center font-score text-xl font-bold text-white">
        {s.teamA.code} {pad2(s.scores.teamA.runs)} – {pad2(s.scores.teamB.runs)} {s.teamB.code}
        <div className="text-sm text-ops-gold">{result.headline}</div>
      </div>
      <ul className="mt-3 space-y-1 text-[12px] text-ops-muted">
        <li>✓ Current match saved to the Match Log</li>
        <li>✓ Runs, balls and outs cleared for both teams</li>
        <li>✓ Status → READY (OBS shows the tournament waiting screen)</li>
        <li>→ Then pick Team A / Team B and the batting team</li>
      </ul>
    </Modal>
  );
};
