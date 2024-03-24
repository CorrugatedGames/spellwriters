import { type Character } from './character';
import { type FieldElement } from './element';
import { type FieldSpell } from './spell';
import { type Spritable } from './sprite';
import type { FieldStatus } from './tile';

/**
 * @category Gameplay
 * @category Field
 */
export interface FieldNode {
  containedSpell?: FieldSpell;
  containedElement?: FieldElement;
  containedStatus?: FieldStatus;
}

/**
 * @category Gameplay
 */
export interface PlayableCard {
  spellId: string;
  instanceId: string;
}

/**
 * @category Gameplay
 */
export interface ActivePlayer extends Spritable {
  id: string;

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
  cardsDrawnThisTurn: number;

  behaviors: Record<string, number>;
  relics: Record<string, number>;
  statusEffects: Record<string, number>;
}

export enum CurrentGameFeature {
  Combat = 'combat',
  StarSpace = 'starspace',
}

/**
 * @category Gameplay
 */
export enum GamePlayer {
  Player = 'Player',
  Opponent = 'Opponent',
}

/**
 * @category Gameplay
 */
export enum GamePhase {
  Start = 'Start',

  PreDraw = 'PreDraw',
  Draw = 'Draw',
  PostDraw = 'PostDraw',

  PreTurn = 'PreTurn',
  Turn = 'Turn',
  PostTurn = 'PostTurn',

  PreSpellMove = 'PreSpellMove',
  SpellMove = 'SpellMove',
  PostSpellMove = 'PostSpellMove',

  End = 'End',

  Victory = 'Victory',
}

/**
 * @category Gameplay
 */
export type CurrentPhase = Record<`${GamePlayer}${GamePhase}`, boolean>;

/**
 * @category Gameplay
 */
export enum TurnOrder {
  Player = 0,
  Opponent = 1,
}

/**
 * @category Gameplay
 */
export interface GameState {
  currentFeature: CurrentGameFeature;
}

/**
 * @category Gameplay
 */
export interface StarSpaceState {}

/**
 * @category Gameplay
 */
export interface CombatState {
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

/**
 * @internal
 */
export interface CombatStateInitOpts {
  fieldWidth: number;
  fieldHeight: number;
  playerCharacter: Character;
  enemyCharacter: Character;
}

/**
 * @category Gameplay
 */
export interface SelectedCard {
  card: PlayableCard;
  index: number;
}
