import { create } from 'zustand';
import {
  IntervalSelection,
  MatchState,
  MatchStatus,
  MusicOutput,
  ScoreAction,
  ScoreState,
  TeamSide,
  WinnerRule,
} from '../types/match';
import { University } from '../types/university';
import {
  appendToArchive,
  createSnapshot,
  emptyScore,
  getInitialMatchState,
  loadFromLocalStorage,
  newMatchId,
  saveToLocalStorage,
} from '../services/persistence';
import { realtimeService } from '../services/realtime';
import { getMatchResult } from '../services/result';

const HISTORY_LIMIT = 50;

export const otherSide = (side: TeamSide): TeamSide => (side === 'teamA' ? 'teamB' : 'teamA');

interface MatchStoreActions {
  setTeam: (side: TeamSide, university: University) => boolean;
  swapTeams: () => void;
  setBattingTeam: (side: TeamSide) => void;
  switchBattingTeam: () => void;
  setStatus: (status: MatchStatus) => void;

  addRuns: (amount: number) => void;
  removeRun: () => void;
  addBall: () => void;
  removeBall: () => void;
  addOut: () => void;
  removeOut: () => void;
  manualOverride: (side: TeamSide, score: ScoreState) => void;

  endTurn: () => void;
  undoLastAction: () => void;
  resetMatch: () => void;
  newMatch: () => void;

  setWinnerRule: (rule: WinnerRule) => void;
  setInterval: (selection: IntervalSelection) => void;
  playInterval: (selection: IntervalSelection) => void;
  setIntervalMusic: (on: boolean) => void;
  setMusicOutput: (output: MusicOutput) => void;

  hydrate: (state: MatchState) => void;
}

export type MatchStore = MatchState & MatchStoreActions;

const pickState = (s: MatchStore): MatchState => ({ ...createSnapshot(s), history: s.history, updatedAt: s.updatedAt });

export const useMatchStore = create<MatchStore>((set, get) => {
  const commit = (draft: MatchState) => {
    // Always newer than what this window has seen, so other windows accept it even if the clock jumps back.
    const next = { ...draft, updatedAt: Math.max(Date.now(), get().updatedAt + 1) };
    saveToLocalStorage(next);
    realtimeService.broadcast(next);
    set(next);
  };

  /**
   * Applies a change. When `description` is given, the previous state is pushed
   * onto the undo history so the change can be reverted.
   */
  const apply = (updater: (s: MatchState) => Partial<MatchState> | null, type?: string, description?: string) => {
    const current = pickState(get());
    const partial = updater(current);
    if (!partial) return;

    let history = current.history;
    if (type && description) {
      const action: ScoreAction = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        type,
        description,
        snapshot: createSnapshot(current),
      };
      history = [action, ...current.history].slice(0, HISTORY_LIMIT);
    }

    commit({ ...current, ...partial, history, updatedAt: Date.now() });
  };

  /** Score change for the batting side. Locked (turn ended) sides are ignored. */
  const changeScore = (field: keyof ScoreState, delta: number, type: string, label: string) =>
    apply(
      (s) => {
        const side = s.battingTeam;
        if (s.turnDone[side]) return null;
        const value = Math.max(0, s.scores[side][field] + delta);
        if (value === s.scores[side][field]) return null;
        return { scores: { ...s.scores, [side]: { ...s.scores[side], [field]: value } } };
      },
      type,
      `${label} · ${get()[get().battingTeam].code}`
    );

  return {
    ...loadFromLocalStorage(),

    setTeam: (side, university) => {
      const s = get();
      if (s[otherSide(side)].id === university.id) return false;
      if (s[side].id === university.id) return true;
      apply(() => ({ [side]: university }), 'TEAM', `Team ${side === 'teamA' ? 'A' : 'B'} → ${university.code}`);
      return true;
    },

    swapTeams: () =>
      apply(
        (s) => ({
          teamA: s.teamB,
          teamB: s.teamA,
          scores: { teamA: s.scores.teamB, teamB: s.scores.teamA },
          turnDone: { teamA: s.turnDone.teamB, teamB: s.turnDone.teamA },
          battingTeam: otherSide(s.battingTeam),
        }),
        'SWAP',
        'Swapped Team A / Team B'
      ),

    setBattingTeam: (side) =>
      apply((s) => (s.battingTeam === side ? null : { battingTeam: side }), 'BATTING', `Batting → ${get()[side].code}`),

    switchBattingTeam: () => get().setBattingTeam(otherSide(get().battingTeam)),

    setStatus: (status) =>
      apply((s) => (s.status === status ? null : { status }), 'STATUS', `Status → ${status}`),

    addRuns: (amount) => changeScore('runs', amount, 'RUN', `+${amount} Run${amount > 1 ? 's' : ''}`),
    removeRun: () => changeScore('runs', -1, 'RUN', '-1 Run'),
    addBall: () => changeScore('balls', 1, 'BALL', '+1 Ball'),
    removeBall: () => changeScore('balls', -1, 'BALL', '-1 Ball'),
    addOut: () => changeScore('outs', 1, 'OUT', '+1 Out'),
    removeOut: () => changeScore('outs', -1, 'OUT', '-1 Out'),

    manualOverride: (side, score) => {
      const clean: ScoreState = {
        runs: Math.max(0, Math.floor(score.runs) || 0),
        balls: Math.max(0, Math.floor(score.balls) || 0),
        outs: Math.max(0, Math.floor(score.outs) || 0),
      };
      apply(
        (s) => ({ scores: { ...s.scores, [side]: clean } }),
        'OVERRIDE',
        `Manual override ${get()[side].code}: ${clean.runs}R ${clean.balls}B ${clean.outs}O`
      );
    },

    endTurn: () =>
      apply(
        (s) => {
          const side = s.battingTeam;
          if (s.turnDone[side]) return null;
          const turnDone = { ...s.turnDone, [side]: true };
          const next = otherSide(side);
          return { turnDone, battingTeam: turnDone[next] ? side : next };
        },
        'END_TURN',
        `Turn ended · ${get()[get().battingTeam].code} ${get().scores[get().battingTeam].runs}R`
      ),

    undoLastAction: () => {
      const s = get();
      const [last, ...rest] = s.history;
      if (!last) return;
      // Interval media choice and music are operator preferences, not score state.
      commit({
        ...last.snapshot,
        interval: s.interval,
        intervalMusic: s.intervalMusic,
        musicOutput: s.musicOutput,
        history: rest,
        updatedAt: Date.now(),
      });
    },

    resetMatch: () => {
      const s = get();
      commit({
        ...pickState(s),
        status: 'READY',
        battingTeam: 'teamA',
        scores: { teamA: emptyScore(), teamB: emptyScore() },
        turnDone: { teamA: false, teamB: false },
        winnerRule: 'AUTO',
        history: [],
        updatedAt: Date.now(),
      });
    },

    newMatch: () => {
      const s = pickState(get());
      const played = s.history.length > 0 || s.scores.teamA.runs + s.scores.teamB.runs > 0;
      if (played) {
        appendToArchive({
          matchId: s.matchId,
          matchNumber: s.matchNumber,
          teamA: s.teamA.code,
          teamB: s.teamB.code,
          scores: s.scores,
          result: getMatchResult(s).headline,
          savedAt: Date.now(),
        });
      }
      const fresh = getInitialMatchState();
      commit({
        ...fresh,
        matchId: newMatchId(),
        matchNumber: played ? s.matchNumber + 1 : s.matchNumber,
        teamA: s.teamA,
        teamB: s.teamB,
        interval: s.interval,
        intervalMusic: s.intervalMusic,
        musicOutput: s.musicOutput,
      });
    },

    setWinnerRule: (rule) =>
      apply((s) => (s.winnerRule === rule ? null : { winnerRule: rule }), 'WINNER', `Winner rule → ${rule}`),

    setInterval: (selection) => apply(() => ({ interval: selection })),

    playInterval: (selection) =>
      apply(() => ({ interval: selection, status: 'INTERVAL' as MatchStatus }), 'STATUS', 'Status → INTERVAL (media loop)'),

    setIntervalMusic: (on) => apply(() => ({ intervalMusic: on })),

    setMusicOutput: (output) => apply(() => ({ musicOutput: output })),

    hydrate: (state) => {
      if (state.updatedAt <= get().updatedAt) return;
      saveToLocalStorage(state);
      set(state);
    },
  };
});
