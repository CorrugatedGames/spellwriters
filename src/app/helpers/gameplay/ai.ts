import { GamePhase, TurnOrder } from '../../interfaces';
import { nextPhase } from './meta';
import { gamestate } from './signal';

export function aiAttemptAction(): void {
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

export function aiDrawPhase(): void {
  // skip draw
  nextPhase();
}

export function aiSpendPhase(): void {
  // skip spend
  nextPhase();
}

export function aiEndPhase(): void {
  // skip end
  nextPhase();
}
