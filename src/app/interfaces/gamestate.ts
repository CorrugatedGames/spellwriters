import { Character } from './character';
import { FieldElement } from './element';
import { FieldSpell } from './spell';

export interface FieldNode {
  containedSpell?: FieldSpell;
  containedElement?: FieldElement;
}

export interface PlayableCard {
  id: string;
}

export interface ActivePlayer {
  id: string;
  sprite: number;

  turnOrder: TurnOrder;

  name: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;

  hand: PlayableCard[];
  deck: PlayableCard[];
  discard: PlayableCard[];

  spellsCastThisTurn: number;

  behaviors: Record<string, number>;
  relics: Record<string, number>;
}

export enum GamePlayer {
  Player = 'Player',
  Opponent = 'Opponent',
}

export enum GamePhase {
  Start = 'Start',
  Draw = 'Draw',
  Turn = 'Turn',
  SpellMove = 'SpellMove',
  End = 'End',
  Victory = 'Victory',
}

export type CurrentPhase = Record<`${GamePlayer}${GamePhase}`, boolean>;

export enum TurnOrder {
  Player = 0,
  Opponent = 1,
}

export interface GameState {
  id: string;
  rng: number;

  currentRound: number;
  currentTurn: TurnOrder;
  currentPhase: GamePhase;

  players: ActivePlayer[];

  width: number;
  height: number;
  field: FieldNode[][];

  spellQueue: string[];
}

export interface GameStateInitOpts {
  fieldWidth: number;
  fieldHeight: number;
  playerCharacter: Character;
  enemyCharacter: Character;
}

export interface SelectedCard {
  card: PlayableCard;
  index: number;
}
