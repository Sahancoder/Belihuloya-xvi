import { University } from './university';

/** NORMAL_LIVE = camera only with a branding footer, for ceremonies, speeches and awards (no match data). */
export type MatchStatus = 'READY' | 'LIVE' | 'NORMAL_LIVE' | 'INTERVAL' | 'FINISHED';

export const statusLabel = (status: MatchStatus): string => status.replace('_', ' ');

export type TeamSide = 'teamA' | 'teamB';

export interface ScoreState {
  runs: number;
  balls: number;
  outs: number;
}

/** How the winner is decided on the FINISHED screen. AUTO = most runs wins. */
export type WinnerRule = 'AUTO' | 'teamA' | 'teamB' | 'TIE';

export type MusicOutput = 'overlay' | 'control';

export interface IntervalSelection {
  /** Media library item id (built-in or uploaded file name). */
  id: string;
  /** Uploaded video/image URL, or null to use the built-in animated screen. */
  mediaUrl: string | null;
}

export interface MatchSnapshot {
  matchId: string;
  matchNumber: number;
  teamA: University;
  teamB: University;
  battingTeam: TeamSide;
  status: MatchStatus;
  scores: Record<TeamSide, ScoreState>;
  /** A side whose batting turn has been ended is locked. */
  turnDone: Record<TeamSide, boolean>;
  winnerRule: WinnerRule;
  interval: IntervalSelection;
  intervalMusic: boolean;
  /** Where interval music plays: inside the OBS overlay, or from the control panel window. */
  musicOutput: MusicOutput;
}

export interface ScoreAction {
  id: string;
  timestamp: number;
  type: string;
  description: string;
  snapshot: MatchSnapshot;
}

export interface MatchState extends MatchSnapshot {
  history: ScoreAction[];
  updatedAt: number;
}

export interface ArchivedMatch {
  matchId: string;
  matchNumber: number;
  teamA: string;
  teamB: string;
  scores: Record<TeamSide, ScoreState>;
  result: string;
  savedAt: number;
}
