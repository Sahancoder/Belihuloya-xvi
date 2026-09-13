import { create } from 'zustand';
import { MatchState, MatchSnapshot, MatchStatus, BattingTeam, ScoreAction, Innings } from '../types/match';
import { University } from '../types/university';
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  createSnapshot,
  getInitialMatchState,
} from '../services/persistence';
import { realtimeService } from '../services/realtime';

interface MatchStoreActions {
  // Team actions
  setTeams: (teamA: University, teamB: University) => void;
  setBattingTeam: (team: BattingTeam) => void;
  setStatus: (status: MatchStatus) => void;

  // Score adjustments
  addRuns: (amount: number) => void;
  decrementRuns: () => void;
  addBall: () => void;
  decrementBall: () => void;
  addOut: () => void;
  decrementOut: () => void;
  manualOverrideScore: (runs: number, balls: number, outs: number) => void;

  // Innings and flow
  switchBattingTeam: () => void;
  endInnings: () => void;

  // History / Undo
  undoLastAction: () => void;

  // Display settings
  setShowUniversitiesCard: (show: boolean) => void;

  // Resets
  resetScore: () => void;
  resetInnings: () => void;
  resetMatch: () => void;

  // Sync / Hydrate
  hydrateFromSnapshot: (snapshot: MatchSnapshot, lastSavedTime?: string, updatedAt?: number) => void;
}

export type MatchStore = MatchState & MatchStoreActions;

export const useMatchStore = create<MatchStore>((set, get) => {
  const initial = loadFromLocalStorage();

  const recordAndSync = (
    updater: (state: MatchState) => Partial<MatchState>,
    actionType?: string,
    actionDesc?: string
  ) => {
    set((state) => {
      // Create snapshot before change if an action is recorded
      let newHistory = state.history;
      if (actionType && actionDesc) {
        const snapshot = createSnapshot(state);
        const action: ScoreAction = {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          timestamp: Date.now(),
          type: actionType,
          description: actionDesc,
          snapshot,
        };
        newHistory = [action, ...state.history.slice(0, 49)];
      }

      const partial = updater(state);
      const now = Date.now();
      const timeStr = new Date().toLocaleTimeString();

      // Determine updated scores for teams based on batting team
      const newBattingTeam = partial.battingTeam ?? state.battingTeam;
      const newScore = partial.score ?? state.score;

      const updatedTeamAScore =
        newBattingTeam === 'teamA' ? newScore : partial.teamAScore ?? state.teamAScore;
      const updatedTeamBScore =
        newBattingTeam === 'teamB' ? newScore : partial.teamBScore ?? state.teamBScore;

      const newState: MatchState = {
        ...state,
        ...partial,
        teamAScore: updatedTeamAScore,
        teamBScore: updatedTeamBScore,
        history: newHistory,
        lastSavedTime: timeStr,
        updatedAt: now,
      };

      // Persist to local storage
      saveToLocalStorage(newState);

      // Broadcast to Overlay via BroadcastChannel
      realtimeService.broadcast(createSnapshot(newState), timeStr, now);

      return newState;
    });
  };

  return {
    ...initial,

    setTeams: (teamA: University, teamB: University) => {
      recordAndSync(
        () => ({ teamA, teamB }),
        'TEAMS_UPDATED',
        `Matchup: ${teamA.code} vs ${teamB.code}`
      );
    },

    setBattingTeam: (team: BattingTeam) => {
      const state = get();
      if (state.battingTeam === team) return;
      const activeScore = team === 'teamA' ? state.teamAScore : state.teamBScore;
      recordAndSync(
        () => ({
          battingTeam: team,
          score: activeScore,
        }),
        'BATTING_TEAM_SWITCHED',
        `Batting switched to ${team === 'teamA' ? state.teamA.code : state.teamB.code}`
      );
    },

    setStatus: (status: MatchStatus) => {
      recordAndSync(
        () => ({ status }),
        'STATUS_CHANGED',
        `Match status changed to ${status}`
      );
    },

    addRuns: (amount: number) => {
      const state = get();
      const newRuns = Math.max(0, state.score.runs + amount);
      const teamCode = state.battingTeam === 'teamA' ? state.teamA.code : state.teamB.code;
      recordAndSync(
        (prev) => ({
          score: { ...prev.score, runs: newRuns },
        }),
        'RUN_ADD',
        `+${amount} Run${amount > 1 ? 's' : ''} (${teamCode})`
      );
    },

    decrementRuns: () => {
      const state = get();
      if (state.score.runs <= 0) return;
      const newRuns = state.score.runs - 1;
      const teamCode = state.battingTeam === 'teamA' ? state.teamA.code : state.teamB.code;
      recordAndSync(
        (prev) => ({
          score: { ...prev.score, runs: newRuns },
        }),
        'RUN_SUBTRACT',
        `-1 Run (${teamCode})`
      );
    },

    addBall: () => {
      const state = get();
      const newBalls = state.score.balls + 1;
      recordAndSync(
        (prev) => ({
          score: { ...prev.score, balls: newBalls },
        }),
        'BALL_ADD',
        `+1 Ball (Total: ${newBalls})`
      );
    },

    decrementBall: () => {
      const state = get();
      if (state.score.balls <= 0) return;
      const newBalls = state.score.balls - 1;
      recordAndSync(
        (prev) => ({
          score: { ...prev.score, balls: newBalls },
        }),
        'BALL_SUBTRACT',
        `-1 Ball (Total: ${newBalls})`
      );
    },

    addOut: () => {
      const state = get();
      const newOuts = state.score.outs + 1;
      const teamCode = state.battingTeam === 'teamA' ? state.teamA.code : state.teamB.code;
      recordAndSync(
        (prev) => ({
          score: { ...prev.score, outs: newOuts },
        }),
        'OUT_ADD',
        `+1 Out (${teamCode} - Total: ${newOuts})`
      );
    },

    decrementOut: () => {
      const state = get();
      if (state.score.outs <= 0) return;
      const newOuts = state.score.outs - 1;
      recordAndSync(
        (prev) => ({
          score: { ...prev.score, outs: newOuts },
        }),
        'OUT_SUBTRACT',
        `-1 Out (Total: ${newOuts})`
      );
    },

    manualOverrideScore: (runs: number, balls: number, outs: number) => {
      const validRuns = Math.max(0, runs);
      const validBalls = Math.max(0, balls);
      const validOuts = Math.max(0, outs);

      recordAndSync(
        () => ({
          score: { runs: validRuns, balls: validBalls, outs: validOuts },
        }),
        'MANUAL_OVERRIDE',
        `Score manually updated to ${validRuns} R, ${validBalls} B, ${validOuts} O`
      );
    },

    switchBattingTeam: () => {
      const state = get();
      const nextTeam: BattingTeam = state.battingTeam === 'teamA' ? 'teamB' : 'teamA';
      const targetScore = nextTeam === 'teamA' ? state.teamAScore : state.teamBScore;
      recordAndSync(
        () => ({
          battingTeam: nextTeam,
          score: targetScore,
        }),
        'SWITCH_BATTING',
        `Switched batting to ${nextTeam === 'teamA' ? state.teamA.code : state.teamB.code}`
      );
    },

    endInnings: () => {
      const state = get();
      const nextInnings: Innings = state.innings === 1 ? 2 : 1;
      const nextBattingTeam: BattingTeam = state.battingTeam === 'teamA' ? 'teamB' : 'teamA';
      const nextScore = nextBattingTeam === 'teamA' ? state.teamAScore : state.teamBScore;

      recordAndSync(
        () => ({
          innings: nextInnings,
          battingTeam: nextBattingTeam,
          score: nextScore,
          status: 'INTERVAL',
        }),
        'END_INNINGS',
        `Innings ended. Switched to ${nextBattingTeam === 'teamA' ? state.teamA.code : state.teamB.code} (Status: INTERVAL)`
      );
    },

    undoLastAction: () => {
      set((state) => {
        if (state.history.length === 0) return state;

        const [lastAction, ...remainingHistory] = state.history;
        const snapshot = lastAction.snapshot;
        const now = Date.now();
        const timeStr = new Date().toLocaleTimeString();

        const restoredState: MatchState = {
          ...state,
          teamA: snapshot.teamA,
          teamB: snapshot.teamB,
          battingTeam: snapshot.battingTeam,
          innings: snapshot.innings,
          status: snapshot.status,
          score: snapshot.score,
          teamAScore: snapshot.teamAScore,
          teamBScore: snapshot.teamBScore,
          history: remainingHistory,
          lastSavedTime: timeStr,
          updatedAt: now,
        };

        saveToLocalStorage(restoredState);
        realtimeService.broadcast(createSnapshot(restoredState), timeStr, now);

        return restoredState;
      });
    },

    resetScore: () => {
      recordAndSync(
        (prev) => ({
          score: { runs: 0, balls: 0, outs: 0 },
          teamAScore: prev.battingTeam === 'teamA' ? { runs: 0, balls: 0, outs: 0 } : prev.teamAScore,
          teamBScore: prev.battingTeam === 'teamB' ? { runs: 0, balls: 0, outs: 0 } : prev.teamBScore,
        }),
        'RESET_SCORE',
        'Current batting score reset to 0'
      );
    },

    resetInnings: () => {
      recordAndSync(
        () => ({
          innings: 1,
          score: { runs: 0, balls: 0, outs: 0 },
          teamAScore: { runs: 0, balls: 0, outs: 0 },
          teamBScore: { runs: 0, balls: 0, outs: 0 },
        }),
        'RESET_INNINGS',
        'Innings reset to Innings 1 (all scores 0)'
      );
    },

    setShowUniversitiesCard: (show: boolean) => {
      recordAndSync(
        () => ({ showUniversitiesCard: show }),
        'TOGGLE_UNIVERSITIES_CARD',
        `Participating Universities card ${show ? 'shown' : 'hidden'}`
      );
    },

    resetMatch: () => {
      const initial = getInitialMatchState();
      set({
        ...initial,
        history: [],
        lastSavedTime: new Date().toLocaleTimeString(),
        updatedAt: Date.now(),
      });
      saveToLocalStorage(initial);
      realtimeService.broadcast(createSnapshot(initial), initial.lastSavedTime, initial.updatedAt);
    },

    hydrateFromSnapshot: (snapshot: MatchSnapshot, lastSavedTime?: string, updatedAt?: number) => {
      set((state) => ({
        ...state,
        ...snapshot,
        lastSavedTime: lastSavedTime || state.lastSavedTime,
        updatedAt: updatedAt || state.updatedAt,
      }));
    },
  };
});
