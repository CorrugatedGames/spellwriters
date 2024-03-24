import {
  CombatPhase,
  CombatTurnOrder,
  type CombatActivePlayer,
} from '../../interfaces';
import { combatState, saveCombatState } from './combatstate';
import { callRitualGlobalFunction } from './ritual';
import { gainMana } from './stats';
import { reshuffleDeck } from './turn';
import { setPhaseBannerString } from './vfx';

const phaseAutoTransition: Record<CombatPhase, boolean> = {
  [CombatPhase.Start]: false,
  [CombatPhase.PreDraw]: true,
  [CombatPhase.Draw]: false,
  [CombatPhase.PostDraw]: true,
  [CombatPhase.PreTurn]: true,
  [CombatPhase.Turn]: false,
  [CombatPhase.PostTurn]: true,
  [CombatPhase.PreSpellMove]: true,
  [CombatPhase.SpellMove]: false,
  [CombatPhase.PostSpellMove]: true,
  [CombatPhase.End]: false,
  [CombatPhase.Victory]: false,
};

const phaseNextPhase: Record<CombatPhase, CombatPhase> = {
  [CombatPhase.Start]: CombatPhase.PreDraw,
  [CombatPhase.PreDraw]: CombatPhase.Draw,
  [CombatPhase.Draw]: CombatPhase.PostDraw,
  [CombatPhase.PostDraw]: CombatPhase.PreTurn,
  [CombatPhase.PreTurn]: CombatPhase.Turn,
  [CombatPhase.Turn]: CombatPhase.PostTurn,
  [CombatPhase.PostTurn]: CombatPhase.PreSpellMove,
  [CombatPhase.PreSpellMove]: CombatPhase.SpellMove,
  [CombatPhase.SpellMove]: CombatPhase.PostSpellMove,
  [CombatPhase.PostSpellMove]: CombatPhase.End,
  [CombatPhase.End]: CombatPhase.PreDraw,

  [CombatPhase.Victory]: CombatPhase.Victory,
};

/**
 * This function is marked async, but it doesn't actually do anything asynchronous.
 * The entire purpose is to wait for moveAllSpellsForward() which may have delays in it
 * for the animations.
 *
 * @internal
 */
export async function nextPhase(): Promise<void> {
  const state = combatState();

  const oldPhase: CombatPhase = state.currentPhase;
  const newPhase: CombatPhase = phaseNextPhase[state.currentPhase];

  let newTurn: CombatTurnOrder = state.currentTurn;
  let newRound: number = state.currentRound;
  let newPlayer: CombatActivePlayer;

  const playerString =
    state.currentTurn === CombatTurnOrder.Player ? 'Your' : 'Opponent';
  const otherPlayerString =
    state.currentTurn === CombatTurnOrder.Player ? 'Opponent' : 'Your';

  const phaseActions: Record<CombatPhase, () => void> = {
    [CombatPhase.Start]: () => {
      setPhaseBannerString({ text: `${playerString} Draw Phase` });
    },

    [CombatPhase.PreDraw]: () => {},
    [CombatPhase.Draw]: () => {
      setPhaseBannerString({ text: `${playerString} Spend Phase` });
    },
    [CombatPhase.PostDraw]: () => {},

    [CombatPhase.PreTurn]: () => {},
    [CombatPhase.Turn]: () => {
      setPhaseBannerString({ text: `${playerString} Spell Move Phase` });
    },
    [CombatPhase.PostTurn]: () => {},

    [CombatPhase.PreSpellMove]: () => {},
    [CombatPhase.SpellMove]: () => {
      setPhaseBannerString({ text: `${playerString} End Phase` });
    },
    [CombatPhase.PostSpellMove]: () => {},

    [CombatPhase.End]: () => {
      setPhaseBannerString({ text: `${otherPlayerString} Draw Phase` });

      newTurn =
        state.currentTurn === CombatTurnOrder.Player
          ? CombatTurnOrder.Opponent
          : CombatTurnOrder.Player;

      if (state.currentTurn === CombatTurnOrder.Player) {
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

    [CombatPhase.Victory]: () => {},
  };

  phaseActions[state.currentPhase]();

  saveCombatState({
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

  if (state.currentPhase === CombatPhase.Start) {
    callRitualGlobalFunction({
      func: 'onCombatStart',
      funcOpts: {},
    });
  }

  if (state.currentPhase === CombatPhase.Victory) {
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
  const { players } = combatState();
  if (players.length < 2) return false;

  return players.some((player) => player.health === 0);
}

/**
 * @internal
 */
export function declareVictory(): void {
  const state = combatState();

  if (!hasAnyoneWon()) return;

  const playerHealth = state.players[CombatTurnOrder.Player].health;
  const opponentHealth = state.players[CombatTurnOrder.Opponent].health;

  let winner: CombatTurnOrder;

  if (playerHealth === 0) {
    winner = CombatTurnOrder.Opponent;
  }

  if (opponentHealth === 0) {
    winner = CombatTurnOrder.Player;
  }

  if (
    winner! !== CombatTurnOrder.Player &&
    winner! !== CombatTurnOrder.Opponent
  ) {
    return;
  }

  saveCombatState({
    state: {
      ...state,
      currentTurn: winner,
      currentPhase: CombatPhase.Victory,
    },
  });
}
