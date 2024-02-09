import { ActivePlayer, GamePhase, TurnOrder } from '../../interfaces';
import { callRitualGlobalFunction } from './ritual';
import { gamestate } from './signal';
import { gainMana } from './stats';
import { reshuffleDeck } from './turn';
import { setPhaseBannerString } from './vfx';

/*
 * This function is marked async, but it doesn't actually do anything asynchronous.
 * The entire purpose is to wait for moveAllSpellsForward() which may have delays in it
 * for the animations.
 */
export async function nextPhase(): Promise<void> {
  const state = gamestate();

  let newPhase: GamePhase = state.currentPhase;
  let newTurn: TurnOrder = state.currentTurn;
  let newRound: number = state.currentRound;
  let newPlayer: ActivePlayer;

  const playerString =
    state.currentTurn === TurnOrder.Player ? 'Your' : 'Opponent';
  const otherPlayerString =
    state.currentTurn === TurnOrder.Player ? 'Opponent' : 'Your';

  switch (state.currentPhase) {
    case GamePhase.Start: {
      setPhaseBannerString({ text: `${playerString} Draw Phase` });
      newPhase = GamePhase.Draw;
      break;
    }

    case GamePhase.Draw:
      setPhaseBannerString({ text: `${playerString} Spend Phase` });
      newPhase = GamePhase.Turn;
      break;

    case GamePhase.Turn:
      setPhaseBannerString({ text: `${playerString} Spell Move Phase` });
      newPhase = GamePhase.SpellMove;
      break;

    case GamePhase.SpellMove:
      setPhaseBannerString({ text: `${playerString} End Phase` });
      newPhase = GamePhase.End;
      break;

    case GamePhase.End:
      setPhaseBannerString({ text: `${otherPlayerString} Draw Phase` });
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

  callRitualGlobalFunction({
    func: 'onCombatPhaseChange',
    funcOpts: { newPhase, newTurn },
  });

  if (state.currentPhase === GamePhase.Start) {
    callRitualGlobalFunction({
      func: 'onCombatStart',
      funcOpts: {},
    });
  }

  if (state.currentPhase === GamePhase.Victory) {
    callRitualGlobalFunction({
      func: 'onCombatFinish',
      funcOpts: {},
    });
  }
}

export function hasAnyoneWon(): boolean {
  const { players } = gamestate();
  if (players.length < 2) return false;

  return players.some((player) => player.health === 0);
}

export function declareVictory(): void {
  const state = gamestate();

  if (!hasAnyoneWon()) return;

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
