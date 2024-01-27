import {
  ActivePlayer,
  FieldNode,
  GamePhase,
  GameState,
  GameStateInitOpts,
  TurnOrder,
} from '../../interfaces';
import { saveGamestate } from './signal';
import { turnCharacterIntoActivePlayer } from './transform';
import { getId } from './uuid';

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

export function createBlankActivePlayer(): ActivePlayer {
  return {
    id: '',
    sprite: 0,

    name: '',
    health: 0,
    maxHealth: 0,
    mana: 0,
    maxMana: 0,

    hand: [],
    deck: [],
    discard: [],

    spellsCastThisTurn: 0,

    behaviors: { random: 1 },
  };
}

export function createBlankGameState(): GameState {
  return {
    id: '',
    currentRound: 0,
    currentTurn: TurnOrder.Player,
    currentPhase: GamePhase.Draw,

    players: [createBlankActivePlayer(), createBlankActivePlayer()],

    width: 0,
    height: 0,
    field: [[]],

    spellQueue: [],
  };
}

export function createFreshGameState(opts: {
  id: string;
  gamestateInitOpts: GameStateInitOpts;
}): GameState {
  const { id, gamestateInitOpts } = opts;

  return {
    ...createBlankGameState(),
    id,

    players: [
      turnCharacterIntoActivePlayer({
        character: gamestateInitOpts.playerCharacter,
      }),
      turnCharacterIntoActivePlayer({
        character: gamestateInitOpts.enemyCharacter,
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

export function startCombat(opts: {
  gamestateInitOpts: GameStateInitOpts;
}): void {
  const { gamestateInitOpts } = opts;

  const id = getId();

  const blankState = createBlankGameState();
  blankState.id = id;
  saveGamestate(blankState);

  const freshState = createFreshGameState({ id, gamestateInitOpts });
  saveGamestate(freshState);
}
