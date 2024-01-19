import { GamePhase, TurnOrder } from '../../interfaces';
import { nextPhase } from './meta';
import { gamestate } from './signal';

export function aiAttemptAction() {
  const state = gamestate();

  if (state.currentTurn === TurnOrder.Player) return;

  switch (state.currentPhase) {
    case GamePhase.Draw:
      aiDrawPhase();
      break;

    case GamePhase.Turn:
      aiSpendPhase();
      break;

    case GamePhase.End:
      aiEndPhase();
      break;
  }
}

export function aiDrawPhase() {
  // skip draw
  nextPhase();
}

export function aiSpendPhase() {
  // skip spend
  nextPhase();
}

export function aiEndPhase() {
  // skip end
  nextPhase();
}
