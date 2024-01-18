import { GameState } from '../../interfaces';

export function takeTurn(state: GameState) {
  state.currentTurn += 1;
  if (state.currentTurn >= state.players.length) {
    state.currentTurn = 0;
    state.currentRound += 1;
  }
}
