import { TurnOrder } from './gamestate';

export enum SpellRarity {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Mystical = 'Mystical',
  Legendary = 'Legendary',
}

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

export interface Spell {
  name: string;
  id: string;
  description: string;

  mod: string;
  asset: string;
  sprite: number;

  element: string;
  rarity: SpellRarity;

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
