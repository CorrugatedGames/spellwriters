import { type TurnOrder } from './gamestate';
import { type Spritable } from './sprite';

export enum SpellStat {
  Damage = 'damage',
  Speed = 'speed',
  Cost = 'cost',
  CastTime = 'castTime',
  Depth = 'depth',
  Pattern = 'pattern',
}

export enum SpellStatImpl {
  Damage = 'damage',
  Speed = 'speed',
  Cost = 'cost',
  CastTime = 'castTime',
  DepthMin = 'depthMin',
  DepthMax = 'depthMax',
  Pattern = 'pattern',
}

export interface Spell extends Spritable {
  name: string;
  id: string;
  key: string;
  description: string;

  element: string;
  rarity: string;

  [SpellStatImpl.Damage]: number;
  [SpellStatImpl.Speed]: number;
  [SpellStatImpl.Cost]: number;
  [SpellStatImpl.CastTime]: number;
  [SpellStatImpl.DepthMin]: number;
  [SpellStatImpl.DepthMax]: number;
  [SpellStatImpl.Pattern]: string;

  tags: Record<string, number>;
}

export interface FieldSpell extends Spell {
  caster: TurnOrder;
  castId: string;
}
