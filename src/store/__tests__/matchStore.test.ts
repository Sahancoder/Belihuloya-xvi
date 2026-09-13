import { describe, it, expect, beforeEach } from 'vitest';
import { useMatchStore } from '../matchStore';
import { UNIVERSITIES } from '../../data/universities';
import { loadFromLocalStorage } from '../../services/persistence';

describe('Match Store Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    useMatchStore.getState().resetMatch();
  });

  it('adds +1 run correctly', () => {
    useMatchStore.getState().addRuns(1);
    expect(useMatchStore.getState().score.runs).toBe(1);
  });

  it('adds +4 runs correctly', () => {
    useMatchStore.getState().addRuns(4);
    expect(useMatchStore.getState().score.runs).toBe(4);
  });

  it('subtracts -1 run correctly', () => {
    useMatchStore.getState().addRuns(3);
    useMatchStore.getState().decrementRuns();
    expect(useMatchStore.getState().score.runs).toBe(2);
  });

  it('prevents runs from becoming negative', () => {
    useMatchStore.getState().decrementRuns();
    expect(useMatchStore.getState().score.runs).toBe(0);
    useMatchStore.getState().decrementRuns();
    expect(useMatchStore.getState().score.runs).toBe(0);
  });

  it('adds +1 ball correctly', () => {
    useMatchStore.getState().addBall();
    expect(useMatchStore.getState().score.balls).toBe(1);
  });

  it('prevents balls from becoming negative', () => {
    useMatchStore.getState().decrementBall();
    expect(useMatchStore.getState().score.balls).toBe(0);
  });

  it('adds +1 out correctly', () => {
    useMatchStore.getState().addOut();
    expect(useMatchStore.getState().score.outs).toBe(1);
  });

  it('prevents outs from becoming negative', () => {
    useMatchStore.getState().decrementOut();
    expect(useMatchStore.getState().score.outs).toBe(0);
  });

  it('supports Undo for single action', () => {
    useMatchStore.getState().addRuns(4);
    expect(useMatchStore.getState().score.runs).toBe(4);

    useMatchStore.getState().undoLastAction();
    expect(useMatchStore.getState().score.runs).toBe(0);
  });

  it('supports multiple sequential Undos restoring exact previous states', () => {
    useMatchStore.getState().addRuns(1); // 1
    useMatchStore.getState().addBall();   // 1 ball
    useMatchStore.getState().addRuns(4); // 5 runs
    useMatchStore.getState().addOut();   // 1 out

    expect(useMatchStore.getState().score.runs).toBe(5);
    expect(useMatchStore.getState().score.balls).toBe(1);
    expect(useMatchStore.getState().score.outs).toBe(1);

    // Undo 1: Revert Out
    useMatchStore.getState().undoLastAction();
    expect(useMatchStore.getState().score.outs).toBe(0);
    expect(useMatchStore.getState().score.runs).toBe(5);

    // Undo 2: Revert +4 Runs
    useMatchStore.getState().undoLastAction();
    expect(useMatchStore.getState().score.runs).toBe(1);

    // Undo 3: Revert +1 Ball
    useMatchStore.getState().undoLastAction();
    expect(useMatchStore.getState().score.balls).toBe(0);

    // Undo 4: Revert +1 Run
    useMatchStore.getState().undoLastAction();
    expect(useMatchStore.getState().score.runs).toBe(0);
  });

  it('switches batting team and tracks separate team scores', () => {
    useMatchStore.getState().setBattingTeam('teamA');
    useMatchStore.getState().addRuns(8);
    expect(useMatchStore.getState().teamAScore.runs).toBe(8);

    useMatchStore.getState().switchBattingTeam();
    expect(useMatchStore.getState().battingTeam).toBe('teamB');
    expect(useMatchStore.getState().score.runs).toBe(0);

    useMatchStore.getState().addRuns(12);
    expect(useMatchStore.getState().teamBScore.runs).toBe(12);
    expect(useMatchStore.getState().teamAScore.runs).toBe(8);
  });

  it('ends innings, preserves previous scores and switches batting to INTERVAL', () => {
    useMatchStore.getState().addRuns(15);
    useMatchStore.getState().addBall();
    useMatchStore.getState().endInnings();

    const state = useMatchStore.getState();
    expect(state.status).toBe('INTERVAL');
    expect(state.innings).toBe(2);
    expect(state.battingTeam).toBe('teamB');
  });

  it('resets score safely', () => {
    useMatchStore.getState().addRuns(10);
    useMatchStore.getState().addBall();
    useMatchStore.getState().resetScore();

    expect(useMatchStore.getState().score.runs).toBe(0);
    expect(useMatchStore.getState().score.balls).toBe(0);
    expect(useMatchStore.getState().score.outs).toBe(0);
  });

  it('recovers safely from invalid or corrupted localStorage data', () => {
    localStorage.setItem('belihuloya_match_state', 'corrupted_json{!!');
    const recovered = loadFromLocalStorage();

    expect(recovered.teamA.code).toBe('SUSL');
    expect(recovered.score.runs).toBe(0);
    expect(recovered.score.balls).toBe(0);
    expect(recovered.score.outs).toBe(0);
  });

  it('persists and restores state from localStorage properly', () => {
    useMatchStore.getState().setTeams(UNIVERSITIES[2], UNIVERSITIES[5]);
    useMatchStore.getState().addRuns(7);

    const loaded = loadFromLocalStorage();
    expect(loaded.teamA.code).toBe(UNIVERSITIES[2].code);
    expect(loaded.teamB.code).toBe(UNIVERSITIES[5].code);
    expect(loaded.score.runs).toBe(7);
  });
});
