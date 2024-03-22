import { GamePhase, TurnOrder, type ActivePlayer } from '../../interfaces';
import { gamestate, saveGamestate } from './gamestate';
import { callRitualGlobalFunction } from './ritual';
import { gainMana } from './stats';
import { reshuffleDeck } from './turn';
import { setPhaseBannerString } from './vfx';

const phaseAutoTransition: Record<GamePhase, boolean> = {
  [GamePhase.Start]: false,
  [GamePhase.PreDraw]: true,
  [GamePhase.Draw]: false,
  [GamePhase.PostDraw]: true,
  [GamePhase.PreTurn]: true,
  [GamePhase.Turn]: false,
  [GamePhase.PostTurn]: true,
  [GamePhase.PreSpellMove]: true,
  [GamePhase.SpellMove]: false,
  [GamePhase.PostSpellMove]: true,
  [GamePhase.End]: false,
  [GamePhase.Victory]: false,
};

const phaseNextPhase: Record<GamePhase, GamePhase> = {
  [GamePhase.Start]: GamePhase.PreDraw,
  [GamePhase.PreDraw]: GamePhase.Draw,
  [GamePhase.Draw]: GamePhase.PostDraw,
  [GamePhase.PostDraw]: GamePhase.PreTurn,
  [GamePhase.PreTurn]: GamePhase.Turn,
  [GamePhase.Turn]: GamePhase.PostTurn,
  [GamePhase.PostTurn]: GamePhase.PreSpellMove,
  [GamePhase.PreSpellMove]: GamePhase.SpellMove,
  [GamePhase.SpellMove]: GamePhase.PostSpellMove,
  [GamePhase.PostSpellMove]: GamePhase.End,
  [GamePhase.End]: GamePhase.PreDraw,

  [GamePhase.Victory]: GamePhase.Victory,
};

/**
 * This function is marked async, but it doesn't actually do anything asynchronous.
 * The entire purpose is to wait for moveAllSpellsForward() which may have delays in it
 * for the animations.
 *
 * @internal
 */
export async function nextPhase(): Promise<void> {
  const state = gamestate();

  const oldPhase: GamePhase = state.currentPhase;
  const newPhase: GamePhase = phaseNextPhase[state.currentPhase];

  let newTurn: TurnOrder = state.currentTurn;
  let newRound: number = state.currentRound;
  let newPlayer: ActivePlayer;

  const playerString =
    state.currentTurn === TurnOrder.Player ? 'Your' : 'Opponent';
  const otherPlayerString =
    state.currentTurn === TurnOrder.Player ? 'Opponent' : 'Your';

  const phaseActions: Record<GamePhase, () => void> = {
    [GamePhase.Start]: () => {
      setPhaseBannerString({ text: `${playerString} Draw Phase` });
    },

    [GamePhase.PreDraw]: () => {},
    [GamePhase.Draw]: () => {
      setPhaseBannerString({ text: `${playerString} Spend Phase` });
    },
    [GamePhase.PostDraw]: () => {},

    [GamePhase.PreTurn]: () => {},
    [GamePhase.Turn]: () => {
      setPhaseBannerString({ text: `${playerString} Spell Move Phase` });
    },
    [GamePhase.PostTurn]: () => {},

    [GamePhase.PreSpellMove]: () => {},
    [GamePhase.SpellMove]: () => {
      setPhaseBannerString({ text: `${playerString} End Phase` });
    },
    [GamePhase.PostSpellMove]: () => {},

    [GamePhase.End]: () => {
      setPhaseBannerString({ text: `${otherPlayerString} Draw Phase` });

      newTurn =
        state.currentTurn === TurnOrder.Player
          ? TurnOrder.Opponent
          : TurnOrder.Player;

      if (state.currentTurn === TurnOrder.Player) {
        newRound = state.currentRound + 1;
      }

      newPlayer = state.players[newTurn];

      if (newPlayer.deck.length === 0) {
        reshuffleDeck({ character: newPlayer });
      }

      gainMana({ character: newPlayer, amount: state.currentRound + 1 });
      newPlayer.spellsCastThisTurn = 0;
      newPlayer.cardsDrawnThisTurn = 0;
    },

    [GamePhase.Victory]: () => {},
  };

  phaseActions[state.currentPhase]();

  saveGamestate({
    state: {
      ...state,
      currentPhase: newPhase,
      currentTurn: newTurn,
      currentRound: newRound,
    },
  });

  callRitualGlobalFunction({
    func: 'onCombatPhaseChange',
    funcOpts: { oldPhase, newPhase, newTurn },
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

  if (phaseAutoTransition[newPhase]) {
    await nextPhase();
  }
}

/**
 * @internal
 */
export function hasAnyoneWon(): boolean {
  const { players } = gamestate();
  if (players.length < 2) return false;

  return players.some((player) => player.health === 0);
}

/**
 * @internal
 */
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

  saveGamestate({
    state: {
      ...state,
      currentTurn: winner,
      currentPhase: GamePhase.Victory,
    },
  });
}
