import { Character } from './archetype';
import { FieldSpell } from './spell';

export enum FieldEffect {
  Oil = 'oil',
  Mud = 'mud',
  Steam = 'steam',
}

export interface FieldNode {
  containedSpell?: FieldSpell;
  containedEffect?: FieldEffect;
}

export interface PlayableCard {
  id: string;
}

export interface ActivePlayer {
  id: string;
  sprite: number;

  name: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;

  hand: PlayableCard[];
  deck: PlayableCard[];
  discard: PlayableCard[];
}

export enum GamePlayer {
  Player = 'Player',
  Opponent = 'Opponent',
}

export enum GamePhase {
  Draw = 'Draw',
  Turn = 'Turn',
  End = 'End',
}

export type CurrentPhase = Record<`${GamePlayer}${GamePhase}`, boolean>;

export enum TurnOrder {
  Player = 0,
  Opponent = 1,
}

export interface GameState {
  id: string;
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
