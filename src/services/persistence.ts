import { MatchState, MatchSnapshot } from '../types/match';
import { UNIVERSITIES } from '../data/universities';

const STORAGE_KEY = 'belihuloya_match_state';

export const getInitialMatchState = (): MatchState => {
  const teamA = UNIVERSITIES[0]; // SUSL
  const teamB = UNIVERSITIES[1]; // UOC

  return {
    teamA,
    teamB,
    battingTeam: 'teamA',
    innings: 1,
    status: 'READY',
    score: { runs: 0, balls: 0, outs: 0 },
    teamAScore: { runs: 0, balls: 0, outs: 0 },
    teamBScore: { runs: 0, balls: 0, outs: 0 },
    showUniversitiesCard: true,
    history: [],
    lastSavedTime: new Date().toLocaleTimeString(),
    updatedAt: Date.now(),
  };
};

export const createSnapshot = (state: MatchState): MatchSnapshot => ({
  teamA: state.teamA,
  teamB: state.teamB,
  battingTeam: state.battingTeam,
  innings: state.innings,
  status: state.status,
  score: { ...state.score },
  teamAScore: { ...state.teamAScore },
  teamBScore: { ...state.teamBScore },
  showUniversitiesCard: state.showUniversitiesCard ?? true,
});

export const saveToLocalStorage = (state: MatchState): void => {
  try {
    const dataToSave = {
      teamA: state.teamA,
      teamB: state.teamB,
      battingTeam: state.battingTeam,
      innings: state.innings,
      status: state.status,
      score: state.score,
      teamAScore: state.teamAScore,
      teamBScore: state.teamBScore,
      showUniversitiesCard: state.showUniversitiesCard ?? true,
      history: state.history.slice(0, 50), // keep last 50 actions
      lastSavedTime: new Date().toLocaleTimeString(),
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.warn('Failed to save match state to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): MatchState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialMatchState();

    const parsed = JSON.parse(raw);

    // Validate essential fields
    if (!parsed.teamA || !parsed.teamB || !parsed.score) {
      console.warn('Invalid match state in localStorage. Resetting to defaults.');
      return getInitialMatchState();
    }

    return {
      teamA: parsed.teamA,
      teamB: parsed.teamB,
      battingTeam: parsed.battingTeam === 'teamB' ? 'teamB' : 'teamA',
      innings: parsed.innings === 2 ? 2 : 1,
      status: parsed.status || 'READY',
      score: {
        runs: Math.max(0, Number(parsed.score?.runs) || 0),
        balls: Math.max(0, Number(parsed.score?.balls) || 0),
        outs: Math.max(0, Number(parsed.score?.outs) || 0),
      },
      teamAScore: {
        runs: Math.max(0, Number(parsed.teamAScore?.runs) || 0),
        balls: Math.max(0, Number(parsed.teamAScore?.balls) || 0),
        outs: Math.max(0, Number(parsed.teamAScore?.outs) || 0),
      },
      teamBScore: {
        runs: Math.max(0, Number(parsed.teamBScore?.runs) || 0),
        balls: Math.max(0, Number(parsed.teamBScore?.balls) || 0),
        outs: Math.max(0, Number(parsed.teamBScore?.outs) || 0),
      },
      showUniversitiesCard: typeof parsed.showUniversitiesCard === 'boolean' ? parsed.showUniversitiesCard : true,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      lastSavedTime: parsed.lastSavedTime || new Date().toLocaleTimeString(),
      updatedAt: parsed.updatedAt || Date.now(),
    };
  } catch (error) {
    console.error('Error reading localStorage, recovering with default state:', error);
    return getInitialMatchState();
  }
};
