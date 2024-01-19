import { GamePhase, TurnOrder } from '../../interfaces';
import { gamestate } from './signal';

export function nextPhase() {
  const state = gamestate();

  let newPhase: GamePhase;
  let newTurn: TurnOrder;
  let newRound: number;

  switch (state.currentPhase) {
    case GamePhase.Draw:
      newPhase = GamePhase.Spend;
      break;

    case GamePhase.Spend:
      newPhase = GamePhase.End;
      break;

    case GamePhase.End:
      newPhase = GamePhase.Draw;

      newTurn =
        state.currentTurn === TurnOrder.Player
          ? TurnOrder.Opponent
          : TurnOrder.Player;

      if (state.currentTurn === TurnOrder.Player) {
        newRound = state.currentRound + 1;
      }

      break;
  }

  gamestate.update((state) => {
    return {
      ...state,
      currentPhase: newPhase,
      currentTurn: newTurn,
      currentRound: newRound,
    };
  });
}
