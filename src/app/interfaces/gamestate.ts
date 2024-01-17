import { Character } from './archetype';

export enum FieldEffect {
  Oil = 'oil',
  Mud = 'mud',
  Steam = 'steam',
}

export interface FieldNode {
  containedSpell?: string;
  containedEffect?: FieldEffect;
}

export interface PlayableCard {
  id: string;
}

export interface ActivePlayer {
  name: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;

  hand: PlayableCard[];
  deck: PlayableCard[];
  discard: PlayableCard[];
}

export interface GameState {
  id: string;
  currentRound: number;

  players: ActivePlayer[];

  width: number;
  height: number;
  field: FieldNode[][];
}

export interface GameStateInitOpts {
  fieldWidth: number;
  fieldHeight: number;
  playerCharacter: Character;
  enemyCharacter: Character;
}
