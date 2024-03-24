import {
  CombatPhase,
  CombatPlayer,
  CombatTurnOrder,
  type Character,
  type CombatActivePlayer,
  type CombatPlayableCard,
  type CombatState,
  type CurrentCombatPhase,
} from '../../interfaces';
import { getId } from '../static/uuid';
import { drawCard, shuffleDeck } from './turn';

/**
 * @internal
 */
export function createBlankStateMachineMap(): CurrentCombatPhase {
  const keys: Partial<CurrentCombatPhase> = {};

  Object.keys(CombatPlayer).forEach((player) => {
    Object.keys(CombatPhase).forEach((phase) => {
      keys[`${player as CombatPlayer}${phase as CombatPhase}`] = false;
    });
  });

  return keys as CurrentCombatPhase;
}

/**
 * @internal
 */
export function phaseObjectFromGameState(opts: { state: CombatState }): {
  turn: string;
  phase: CombatPhase;
} {
  const { state } = opts;
  return {
    turn: state.currentTurn === CombatTurnOrder.Player ? 'Player' : 'Opponent',
    phase: state.currentPhase,
  };
}

/**
 * @internal
 */
export function phaseNameFromGameState(opts: { state: CombatState }): string {
  const { state } = opts;
  const { turn, phase } = phaseObjectFromGameState({ state });

  return `${turn} ${phase}`;
}

/**
 * @internal
 */
export function stateMachineMapFromGameState(opts: {
  state: CombatState;
}): CurrentCombatPhase {
  const { state } = opts;
  const { turn, phase } = phaseObjectFromGameState({ state });

  return {
    ...createBlankStateMachineMap(),
    [`${turn}${phase}`]: true,
  };
}

/**
 * @internal
 */
export function turnCardIntoPlayableCard(opts: {
  id: string;
}): CombatPlayableCard {
  const { id } = opts;
  return { spellId: id, instanceId: getId() };
}

/**
 * @internal
 */
export function turnCharacterIntoActivePlayer(opts: {
  character: Character;
  turnOrder: CombatTurnOrder;
}): CombatActivePlayer {
  const { character } = opts;
  const deck = character.deck.spells.map((id) =>
    turnCardIntoPlayableCard({ id }),
  );

  const player: CombatActivePlayer = {
    id: character.id,
    mod: character.mod,
    asset: character.asset,
    sprite: character.sprite,
    turnOrder: opts.turnOrder,
    name: character.name,
    health: character.maxHealth,
    maxHealth: character.maxHealth,
    mana: 1,
    maxMana: 10,
    hand: [],
    deck,
    discard: [],
    spellsCastThisTurn: 0,
    cardsDrawnThisTurn: 0,
    behaviors: character.behaviors,
    relics: character.relics,
    statusEffects: {},
  };

  shuffleDeck({ character: player });

  for (let i = 0; i < 3; i++) {
    drawCard({ character: player });
  }

  return player;
}
