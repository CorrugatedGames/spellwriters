import { TurnOrder } from './gamestate';

export enum SpellRarity {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Mystical = 'Mystical',
  Legendary = 'Legendary',
}

export enum SpellPattern {
  Single = '1x1',
  Double = '2x1',
  Triple = '3x1',
  Wide = '5x1',
}

export enum SpellElement {
  Fire = 'Fire',
  Water = 'Water',
  Earth = 'Earth',
  Electric = 'Electric',
}

export enum SpellStat {
  Damage = 'damage',
  Speed = 'speed',
  Cost = 'cost',
  CastTime = 'castTime',
  Depth = 'depth',
  Pattern = 'pattern',
}

export enum SpellTag {
  Explodes = 'explodes',
  Dissipates = 'dissipates',
  Steamy = 'steamy',
  Muddy = 'muddy',
  Oily = 'oily',
}

export interface Spell {
  name: string;
  id: string;
  description: string;

  mod: string;
  asset: string;
  sprite: number;

  element: SpellElement;
  rarity: SpellRarity;

  damage: number;
  speed: number;
  cost: number;
  castTime: number;
  depthMin: number;
  depthMax: number;
  pattern: SpellPattern;

  tags: Partial<Record<SpellTag, number>>;
}

export interface FieldSpell extends Spell {
  caster: TurnOrder;
  castId: string;
}
