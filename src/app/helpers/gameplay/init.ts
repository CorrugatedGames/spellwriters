import {
  CombatPhase,
  CombatTurnOrder,
  GameFeature,
  type CombatActivePlayer,
  type CombatState,
  type CombatStateInitOpts,
  type FieldNode,
  type GameState,
} from '../../interfaces';
import { getId } from '../static/uuid';
import { saveCombatState } from './combatstate';
import { turnCharacterIntoActivePlayer } from './transform';

/**
 * @internal
 */
export function createBlankFieldRecord(opts: {
  width: number;
  height: number;
}): Record<number, Record<number, unknown>> {
  const { width, height } = opts;

  const field: Record<number, Record<number, unknown>> = {};

  for (let y = 0; y < height; y++) {
    const row: Record<number, unknown> = {};

    for (let x = 0; x < width; x++) {
      row[x] = undefined;
    }

    field[y] = row;
  }

  return field;
}

/**
 * @internal
 */
export function createBlankField(opts: {
  width: number;
  height: number;
}): FieldNode[][] {
  const { width, height } = opts;
  const field: FieldNode[][] = [];

  for (let y = 0; y < height; y++) {
    const row: FieldNode[] = [];

    for (let x = 0; x < width; x++) {
      row.push({});
    }

    field.push(row);
  }

  return field;
}

/**
 * @internal
 */
export function createBlankActivePlayer(): CombatActivePlayer {
  return {
    id: '',
    mod: 'default',
    asset: 'characters.webp',
    sprite: 0,
    turnOrder: CombatTurnOrder.Player,

    name: '',
    health: 1,
    maxHealth: 1,
    mana: 0,
    maxMana: 0,

    hand: [],
    deck: [],
    discard: [],

    spellsCastThisTurn: 0,
    cardsDrawnThisTurn: 0,

    behaviors: { random: 1 },
    relics: {},
    statusEffects: {},
  };
}

/**
 * @internal
 */
export function createBlankCombatState(): CombatState {
  return {
    id: '',
    rng: 0,
    currentRound: 0,
    currentTurn: CombatTurnOrder.Player,
    currentPhase: CombatPhase.Start,

    players: [createBlankActivePlayer(), createBlankActivePlayer()],

    width: 0,
    height: 0,
    field: [[]],

    spellQueue: [],
  };
}

/**
 * @internal
 */
export function createBlankGameState(): GameState {
  return {
    currentAct: 0,
    currentStage: 0,
    currentFeature: GameFeature.StarSpace,
  };
}

/**
 * @internal
 */
export function createFreshCombatState(opts: {
  id: string;
  gamestateInitOpts: CombatStateInitOpts;
}): CombatState {
  const { id, gamestateInitOpts } = opts;

  return {
    ...createBlankCombatState(),
    id,

    players: [
      turnCharacterIntoActivePlayer({
        character: gamestateInitOpts.playerCharacter,
        turnOrder: CombatTurnOrder.Player,
      }),
      turnCharacterIntoActivePlayer({
        character: gamestateInitOpts.enemyCharacter,
        turnOrder: CombatTurnOrder.Opponent,
      }),
    ],

    width: gamestateInitOpts.fieldWidth,
    height: gamestateInitOpts.fieldHeight + 2,
    field: createBlankField({
      width: gamestateInitOpts.fieldWidth,
      height: gamestateInitOpts.fieldHeight + 2,
    }),
  };
}

/**
 * @internal
 */
export function startCombat(opts: {
  gamestateInitOpts: CombatStateInitOpts;
}): void {
  const { gamestateInitOpts } = opts;

  const id = getId();

  const blankState = createBlankCombatState();
  blankState.id = id;
  saveCombatState({ state: blankState });

  const freshState = createFreshCombatState({ id, gamestateInitOpts });
  saveCombatState({ state: freshState });
}
