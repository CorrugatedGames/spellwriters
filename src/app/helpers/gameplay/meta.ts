import { ActivePlayer, GamePhase, TurnOrder } from '../../interfaces';
import { gamestate } from './signal';
import { gainMana } from './stats';
import { reshuffleDeck } from './turn';

/*
 * This function is marked async, but it doesn't actually do anything asynchronous.
 * The entire purpose is to wait for moveAllSpellsForward() which may have delays in it
 * for the animations.
 *
 * In general, game logic, at this time, is not asynchronous nor should it be.
 */
export async function nextPhase(): Promise<void> {
  const state = gamestate();

  let newPhase: GamePhase = state.currentPhase;
  let newTurn: TurnOrder = state.currentTurn;
  let newRound: number = state.currentRound;
  let newPlayer: ActivePlayer;

  switch (state.currentPhase) {
    case GamePhase.Draw:
      newPhase = GamePhase.Turn;
      break;

    case GamePhase.Turn:
      newPhase = GamePhase.SpellMove;
      break;

    case GamePhase.SpellMove:
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

      newPlayer = state.players[newTurn];

      if (newPlayer.deck.length === 0) {
        reshuffleDeck(newPlayer);
      }

      gainMana({ character: newPlayer, amount: state.currentRound + 1 });
      newPlayer.spellsCastThisTurn = 0;

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

export function hasAnyoneWon(opts: { players: ActivePlayer[] }): boolean {
  const { players } = opts;

  return players.some((player) => player.health === 0);
}

export function declareVictory(): void {
  const state = gamestate();

  if (!hasAnyoneWon({ players: state.players })) return;

  const playerHealth = state.players[TurnOrder.Player].health;
  const opponentHealth = state.players[TurnOrder.Opponent].health;

  let winner: TurnOrder;

  if (playerHealth === 0) {
    winner = TurnOrder.Opponent;
  }

  if (opponentHealth === 0) {
    winner = TurnOrder.Player;
  }

  if (winner! !== TurnOrder.Player && winner! !== TurnOrder.Opponent) {
    return;
  }

  gamestate.update((state) => {
    return {
      ...state,
      currentTurn: winner,
      currentPhase: GamePhase.Victory,
    };
  });
}
