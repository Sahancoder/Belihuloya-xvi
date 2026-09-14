import { ArchivedMatch, MatchSnapshot, MatchState, ScoreState, TeamSide } from '../types/match';
import { UNIVERSITIES, getUniversityById } from '../data/universities';
import { DEFAULT_INTERVAL_ID } from '../data/event';

export const STORAGE_KEY = 'belihuloya_match_state_v2';
const ARCHIVE_KEY = 'belihuloya_match_archive';
const HISTORY_LIMIT = 50;

export const emptyScore = (): ScoreState => ({ runs: 0, balls: 0, outs: 0 });

export const newMatchId = () => `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

export const getInitialMatchState = (): MatchState => ({
  matchId: newMatchId(),
  matchNumber: 1,
  teamA: UNIVERSITIES[0],
  teamB: UNIVERSITIES[1],
  battingTeam: 'teamA',
  status: 'READY',
  scores: { teamA: emptyScore(), teamB: emptyScore() },
  turnDone: { teamA: false, teamB: false },
  winnerRule: 'AUTO',
  interval: { id: DEFAULT_INTERVAL_ID, mediaUrl: null },
  intervalMusic: true,
  musicOutput: 'overlay',
  history: [],
  updatedAt: Date.now(),
});

export const createSnapshot = (s: MatchSnapshot): MatchSnapshot => ({
  matchId: s.matchId,
  matchNumber: s.matchNumber,
  teamA: s.teamA,
  teamB: s.teamB,
  battingTeam: s.battingTeam,
  status: s.status,
  scores: { teamA: { ...s.scores.teamA }, teamB: { ...s.scores.teamB } },
  turnDone: { ...s.turnDone },
  winnerRule: s.winnerRule,
  interval: { ...s.interval },
  intervalMusic: s.intervalMusic,
  musicOutput: s.musicOutput,
});

const toCount = (v: unknown) => Math.max(0, Math.floor(Number(v) || 0));

const sanitizeScore = (raw: unknown): ScoreState => {
  const r = (raw ?? {}) as Partial<ScoreState>;
  return { runs: toCount(r.runs), balls: toCount(r.balls), outs: toCount(r.outs) };
};

/** Validates untrusted JSON (localStorage or sync server) into a MatchState. */
export const sanitizeState = (raw: unknown): MatchState | null => {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Partial<MatchState>;
  if (!p.teamA?.id || !p.teamB?.id || !p.scores) return null;

  const base = getInitialMatchState();
  const side = (v: unknown): TeamSide => (v === 'teamB' ? 'teamB' : 'teamA');
  const statuses = ['READY', 'LIVE', 'INTERVAL', 'FINISHED'];
  const rules = ['AUTO', 'teamA', 'teamB', 'TIE'];

  return {
    matchId: typeof p.matchId === 'string' ? p.matchId : base.matchId,
    matchNumber: Math.max(1, toCount(p.matchNumber)),
    teamA: getUniversityById(p.teamA.id),
    teamB: getUniversityById(p.teamB.id),
    battingTeam: side(p.battingTeam),
    status: statuses.includes(p.status as string) ? (p.status as MatchState['status']) : 'READY',
    scores: { teamA: sanitizeScore(p.scores.teamA), teamB: sanitizeScore(p.scores.teamB) },
    turnDone: { teamA: !!p.turnDone?.teamA, teamB: !!p.turnDone?.teamB },
    winnerRule: rules.includes(p.winnerRule as string) ? (p.winnerRule as MatchState['winnerRule']) : 'AUTO',
    interval:
      p.interval && typeof p.interval.id === 'string'
        ? { id: p.interval.id, mediaUrl: typeof p.interval.mediaUrl === 'string' ? p.interval.mediaUrl : null }
        : base.interval,
    intervalMusic: typeof p.intervalMusic === 'boolean' ? p.intervalMusic : true,
    musicOutput: p.musicOutput === 'control' ? 'control' : 'overlay',
    history: Array.isArray(p.history) ? p.history.slice(0, HISTORY_LIMIT) : [],
    updatedAt: Number(p.updatedAt) || Date.now(),
  };
};

export const saveToLocalStorage = (state: MatchState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, history: state.history.slice(0, HISTORY_LIMIT) }));
  } catch (error) {
    console.warn('Failed to save match state:', error);
  }
};

export const loadFromLocalStorage = (): MatchState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return (raw && sanitizeState(JSON.parse(raw))) || getInitialMatchState();
  } catch (error) {
    console.error('Error reading saved match, starting fresh:', error);
    return getInitialMatchState();
  }
};

export const loadArchive = (): ArchivedMatch[] => {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const appendToArchive = (entry: ArchivedMatch): void => {
  try {
    const next = [entry, ...loadArchive().filter((m) => m.matchId !== entry.matchId)].slice(0, 100);
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(next));
  } catch (error) {
    console.warn('Failed to archive match:', error);
  }
};
