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

    spellsCastThisTurn: 0,
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

export function createFreshGameState(
  id: string,
  opts: GameStateInitOpts,
): GameState {
  return {
    ...createBlankGameState(),
    id,

    players: [
      turnCharacterIntoActivePlayer(opts.playerCharacter),
      turnCharacterIntoActivePlayer(opts.enemyCharacter),
    ],

    width: opts.fieldWidth,
    height: opts.fieldHeight + 2,
    field: createBlankField(opts.fieldWidth, opts.fieldHeight + 2),
  };
}

export function startCombat(opts: GameStateInitOpts) {
  const id = getId();

  const blankState = createBlankGameState();
  blankState.id = id;
  saveGamestate(blankState);

  const freshState = createFreshGameState(id, opts);
  saveGamestate(freshState);
}
