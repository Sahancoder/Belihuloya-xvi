import { describe, it, expect, beforeEach } from 'vitest';
import { useMatchStore } from '../matchStore';
import { UNIVERSITIES } from '../../data/universities';
import { STORAGE_KEY, getInitialMatchState, loadArchive, loadFromLocalStorage } from '../../services/persistence';
import { getMatchResult } from '../../services/result';

const s = () => useMatchStore.getState();
const batting = () => s().scores[s().battingTeam];

describe('match store', () => {
  beforeEach(() => {
    localStorage.clear();
    useMatchStore.setState({ ...getInitialMatchState(), updatedAt: 0 });
  });

  it('adds runs, balls and outs to the batting team', () => {
    s().addRuns(4);
    s().addRuns(1);
    s().addBall();
    s().addOut();
    expect(batting()).toEqual({ runs: 5, balls: 1, outs: 1 });
  });

  it('never goes below zero', () => {
    s().removeRun();
    s().removeBall();
    s().removeOut();
    expect(batting()).toEqual({ runs: 0, balls: 0, outs: 0 });
    expect(s().history).toHaveLength(0);
  });

  it('keeps team scores separate when switching batting team', () => {
    s().addRuns(8);
    s().switchBattingTeam();
    expect(s().battingTeam).toBe('teamB');
    expect(batting().runs).toBe(0);
    s().addRuns(6);
    s().switchBattingTeam();
    expect(batting().runs).toBe(8);
    expect(s().scores.teamB.runs).toBe(6);
  });

  it('prevents the same university on both sides', () => {
    expect(s().setTeam('teamB', s().teamA)).toBe(false);
    expect(s().setTeam('teamB', UNIVERSITIES[2])).toBe(true);
    expect(s().teamB.code).toBe(UNIVERSITIES[2].code);
  });

  it('undoes actions in order', () => {
    s().addRuns(2);
    s().addOut();
    s().undoLastAction();
    expect(batting()).toEqual({ runs: 2, balls: 0, outs: 0 });
    s().undoLastAction();
    expect(batting().runs).toBe(0);
  });

  it('end turn locks the team and switches to the other side', () => {
    s().addRuns(8);
    s().endTurn();
    expect(s().turnDone.teamA).toBe(true);
    expect(s().battingTeam).toBe('teamB');

    s().setBattingTeam('teamA');
    s().addRuns(5);
    expect(s().scores.teamA.runs).toBe(8);

    s().undoLastAction(); // batting switch
    s().undoLastAction(); // end turn
    expect(s().turnDone.teamA).toBe(false);
    expect(s().battingTeam).toBe('teamA');
  });

  it('swap moves scores with teams', () => {
    const a = s().teamA.code;
    s().addRuns(3);
    s().swapTeams();
    expect(s().teamB.code).toBe(a);
    expect(s().scores.teamB.runs).toBe(3);
    expect(s()[s().battingTeam].code).toBe(a);
  });

  it('manual override sets exact values', () => {
    s().manualOverride('teamB', { runs: 8, balls: 14, outs: 2 });
    expect(s().scores.teamB).toEqual({ runs: 8, balls: 14, outs: 2 });
  });

  it('reset clears scores, locks and history', () => {
    s().addRuns(5);
    s().endTurn();
    s().setStatus('LIVE');
    s().resetMatch();
    expect(s().scores.teamA.runs).toBe(0);
    expect(s().turnDone.teamA).toBe(false);
    expect(s().status).toBe('READY');
    expect(s().history).toHaveLength(0);
  });

  it('new match archives the previous match and starts READY', () => {
    s().addRuns(8);
    s().switchBattingTeam();
    s().addRuns(6);
    s().setStatus('FINISHED');
    s().newMatch();

    expect(s().status).toBe('READY');
    expect(s().matchNumber).toBe(2);
    expect(s().scores.teamA.runs + s().scores.teamB.runs).toBe(0);
    const [saved] = loadArchive();
    expect(saved.scores.teamA.runs).toBe(8);
    expect(saved.result).toBe(`${s().teamA.code} WIN`);
  });

  it('decides the winner automatically or manually', () => {
    s().addRuns(3);
    expect(getMatchResult(s()).winner).toBe('teamA');
    s().setWinnerRule('TIE');
    expect(getMatchResult(s()).headline).toBe('MATCH TIED');
  });

  it('persists to localStorage and recovers from corrupted data', () => {
    s().setTeam('teamA', UNIVERSITIES[4]);
    s().addRuns(7);
    const loaded = loadFromLocalStorage();
    expect(loaded.teamA.code).toBe(UNIVERSITIES[4].code);
    expect(loaded.scores.teamA.runs).toBe(7);

    localStorage.setItem(STORAGE_KEY, 'corrupted{');
    expect(loadFromLocalStorage().scores.teamA.runs).toBe(0);
  });
});
