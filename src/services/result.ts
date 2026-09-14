import { MatchSnapshot, TeamSide } from '../types/match';

export interface MatchResult {
  winner: TeamSide | null;
  headline: string;
  detail: string;
}

export const getMatchResult = (s: MatchSnapshot): MatchResult => {
  const a = s.scores.teamA.runs;
  const b = s.scores.teamB.runs;

  let winner: TeamSide | null;
  if (s.winnerRule === 'AUTO') {
    winner = a === b ? null : a > b ? 'teamA' : 'teamB';
  } else {
    winner = s.winnerRule === 'TIE' ? null : s.winnerRule;
  }

  if (!winner) {
    return { winner: null, headline: 'MATCH TIED', detail: `${a} – ${b}` };
  }

  const team = s[winner];
  const margin = Math.abs(a - b);
  return {
    winner,
    headline: `${team.code} WIN`,
    detail: margin > 0 ? `Won by ${margin} run${margin === 1 ? '' : 's'}` : team.name,
  };
};

export const pad2 = (n: number) => String(n).padStart(2, '0');
