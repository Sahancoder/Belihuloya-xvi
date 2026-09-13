import { University } from './university';

export type MatchStatus = 'READY' | 'LIVE' | 'INTERVAL' | 'FINISHED';

export type BattingTeam = 'teamA' | 'teamB';

export type Innings = 1 | 2;

export interface ScoreState {
  runs: number;
  balls: number;
  outs: number;
}

export interface MatchSnapshot {
  teamA: University;
  teamB: University;
  battingTeam: BattingTeam;
  innings: Innings;
  status: MatchStatus;
  score: ScoreState;
  teamAScore: ScoreState;
  teamBScore: ScoreState;
  showUniversitiesCard: boolean;
}

export interface ScoreAction {
  id: string;
  timestamp: number;
  type: string;
  description: string;
  snapshot: MatchSnapshot;
}

export interface MatchState {
  teamA: University;
  teamB: University;
  battingTeam: BattingTeam;
  innings: Innings;
  status: MatchStatus;
  score: ScoreState;
  teamAScore: ScoreState;
  teamBScore: ScoreState;
  showUniversitiesCard: boolean;
  history: ScoreAction[];
  lastSavedTime: string;
  updatedAt: number;
}

export interface BroadcastMessage {
  type: 'MATCH_STATE_UPDATED';
  payload: MatchSnapshot & {
    lastSavedTime: string;
    updatedAt: number;
  };
}
