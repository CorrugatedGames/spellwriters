import { type TurnOrder } from './gamestate';
import { type Spritable } from './sprite';

/**
 * @category Spell
 */
export enum SpellStat {
  Damage = 'damage',
  Speed = 'speed',
  Cost = 'cost',
  CastTime = 'castTime',
  Depth = 'depth',
  Pattern = 'pattern',
}

enum SpellStatImpl {
  Damage = 'damage',
  Speed = 'speed',
  Cost = 'cost',
  CastTime = 'castTime',
  DepthMin = 'depthMin',
  DepthMax = 'depthMax',
}

/**
 * @category Spell
 */
export type SpellStatType = `${SpellStatImpl}`;

/**
 * @category Spell
 */
export type HasStats = Record<SpellStatImpl, number>;

/**
 * @category Spell
 */
export type HasStatsAndSprites = HasStats & Spritable;

/**
 * @category Spell
 * @category Modding
 * @category Mod Data
 */
export interface Spell extends HasStatsAndSprites {
  name: string;
  id: string;
  key: string;
  description: string;

  element: string;
  rarity: string;

  instant?: boolean;

  [SpellStatImpl.Damage]: number;
  [SpellStatImpl.Speed]: number;
  [SpellStatImpl.Cost]: number;
  [SpellStatImpl.CastTime]: number;
  [SpellStatImpl.DepthMin]: number;
  [SpellStatImpl.DepthMax]: number;
  pattern: string;

  tags: Record<string, number>;
}

/**
 * @category Spell
 * @category Field
 */
export interface FieldSpell extends Spell {
  caster: TurnOrder;
  castId: string;

  /**
   * The current x position of the spell. Is not used anywhere except in read-only contexts.
   * Modifying this field will not do anything.
   *
   * @readonly
   */
  x: number;

  /**
   * The current y position of the spell. Is not used anywhere except in read-only contexts.
   * Modifying this field will not do anything.
   *
   * @readonly
   */
  y: number;

  extraData: Record<string, unknown>;
}
