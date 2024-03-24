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
export interface CombatPlayableCard {
  spellId: string;
  instanceId: string;
}

/**
 * @category Gameplay
 */
export interface CombatActivePlayer extends Spritable {
  id: string;

  turnOrder: CombatTurnOrder;

  name: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;

  hand: CombatPlayableCard[];
  deck: CombatPlayableCard[];
  discard: CombatPlayableCard[];

  spellsCastThisTurn: number;
  cardsDrawnThisTurn: number;

  behaviors: Record<string, number>;
  relics: Record<string, number>;
  statusEffects: Record<string, number>;
}

/**
 * @category Gameplay
 */
export enum GameFeature {
  Combat = 'combat',
  StarSpace = 'starspace',
}

/**
 * @category Gameplay
 */
export enum CombatPlayer {
  Player = 'Player',
  Opponent = 'Opponent',
}

/**
 * @category Gameplay
 */
export enum CombatPhase {
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
export type CurrentCombatPhase = Record<
  `${CombatPlayer}${CombatPhase}`,
  boolean
>;

/**
 * @category Gameplay
 */
export enum CombatTurnOrder {
  Player = 0,
  Opponent = 1,
}

/**
 * @category Gameplay
 */
export interface GameState {
  currentAct: number;
  currentStage: number;
  currentFeature: GameFeature;
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
  currentTurn: CombatTurnOrder;
  currentPhase: CombatPhase;

  players: CombatActivePlayer[];

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
export interface CombatSelectedCard {
  card: CombatPlayableCard;
  index: number;
}
