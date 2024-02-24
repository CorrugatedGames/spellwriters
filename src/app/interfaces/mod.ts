import { type AIPattern } from './ai';
import { type Character } from './character';
import { type SpellElement } from './element';
import { type SpellPattern } from './pattern';
import { type Rarity } from './rarity';
import { type Relic } from './relic';
import { type Spell } from './spell';
import type { StatusEffect } from './statuseffect';
import { type SpellTag } from './tag';
import type { TileStatus } from './tile';

/**
 * @category Modding
 */
export interface ContentModSvg {
  name: string;
}

/**
 * @category Modding
 */
export interface ContentModImage {
  name: string;
  spritesPerRow: number;
  spriteSize: number;
  framesPerAnimation: number;
}

/**
 * @internal
 */
export enum ContentModContentKey {
  Character = 'characters',
  Spell = 'spells',
  Element = 'elements',
  SpellPattern = 'spellPatterns',
  AIPattern = 'aiPatterns',
  SpellTag = 'spellTags',
  Rarity = 'rarities',
  Relic = 'relics',
  TileStatus = 'tileStatuses',
  StatusEffect = 'statusEffects',
}

/**
 * @category Modding
 */
export interface ContentMod {
  name: string;
  description: string;
  version: string;
  gameVersion: string;
  author: string;
  dependsOn: string[];

  [ContentModContentKey.AIPattern]: Record<string, AIPattern>;
  [ContentModContentKey.Character]: Record<string, Character>;
  [ContentModContentKey.Rarity]: Record<string, Rarity>;
  [ContentModContentKey.Relic]: Record<string, Relic>;
  [ContentModContentKey.Spell]: Record<string, Spell>;
  [ContentModContentKey.Element]: Record<string, SpellElement>;
  [ContentModContentKey.SpellPattern]: Record<string, SpellPattern>;
  [ContentModContentKey.SpellTag]: Record<string, SpellTag>;
  [ContentModContentKey.StatusEffect]: Record<string, StatusEffect>;
  [ContentModContentKey.TileStatus]: Record<string, TileStatus>;

  preload: {
    colors: Record<string, string>;
    images: Record<string, ContentModImage>;
    svgs: ContentModSvg[];
    scripts: string[];
  };
}
