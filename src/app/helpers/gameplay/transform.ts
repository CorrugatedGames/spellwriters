import {
  GamePhase,
  GamePlayer,
  TurnOrder,
  type ActivePlayer,
  type Character,
  type CombatState,
  type CurrentPhase,
  type PlayableCard,
} from '../../interfaces';
import { getId } from '../static/uuid';
import { drawCard, shuffleDeck } from './turn';

/**
 * @internal
 */
export function createBlankStateMachineMap(): CurrentPhase {
  const keys: Partial<CurrentPhase> = {};

  Object.keys(GamePlayer).forEach((player) => {
    Object.keys(GamePhase).forEach((phase) => {
      keys[`${player as GamePlayer}${phase as GamePhase}`] = false;
    });
  });

  return keys as CurrentPhase;
}

/**
 * @internal
 */
export function phaseObjectFromGameState(opts: { state: CombatState }): {
  turn: string;
  phase: GamePhase;
} {
  const { state } = opts;
  return {
    turn: state.currentTurn === TurnOrder.Player ? 'Player' : 'Opponent',
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
}): CurrentPhase {
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
export function turnCardIntoPlayableCard(opts: { id: string }): PlayableCard {
  const { id } = opts;
  return { spellId: id, instanceId: getId() };
}

/**
 * @internal
 */
export function turnCharacterIntoActivePlayer(opts: {
  character: Character;
  turnOrder: TurnOrder;
}): ActivePlayer {
  const { character } = opts;
  const deck = character.deck.spells.map((id) =>
    turnCardIntoPlayableCard({ id }),
  );

  const player: ActivePlayer = {
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
