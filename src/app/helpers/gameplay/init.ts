import {
  ActivePlayer,
  FieldNode,
  GamePhase,
  GameState,
  GameStateInitOpts,
} from '../../interfaces';
import { turnCharacterIntoActivePlayer } from './transform';

import { v4 as uuid } from 'uuid';

export function createBlankField(width: number, height: number): FieldNode[][] {
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
  };
}

export function createBlankGameState(): GameState {
  return {
    id: '',
    currentRound: 0,
    currentTurn: 0,
    currentPhase: GamePhase.Draw,

    players: [createBlankActivePlayer(), createBlankActivePlayer()],

    width: 0,
    height: 0,
    field: [[]],
  };
}

export function createFreshGameState(opts: GameStateInitOpts): GameState {
  const id = uuid();

  return {
    ...createBlankGameState(),
    id,

    players: [
      turnCharacterIntoActivePlayer(id, opts.playerCharacter),
      turnCharacterIntoActivePlayer(id, opts.enemyCharacter),
    ],

    width: opts.fieldWidth,
    height: opts.fieldHeight + 2,
    field: createBlankField(opts.fieldWidth, opts.fieldHeight + 2),
  };
}
