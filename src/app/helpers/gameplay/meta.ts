import { GamePhase, TurnOrder } from '../../interfaces';
import { gamestate } from './signal';
import { gainMana } from './stats';

export function nextPhase() {
  const state = gamestate();

  let newPhase: GamePhase = state.currentPhase;
  let newTurn: TurnOrder = state.currentTurn;
  let newRound: number = state.currentRound;

  switch (state.currentPhase) {
    case GamePhase.Draw:
      newPhase = GamePhase.Turn;
      break;

    case GamePhase.Turn:
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

      gainMana(state.players[newTurn], 1);

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
