import { type AIPattern } from './ai';
import { type Character } from './character';
import { type SpellElement } from './element';
import { type SpellPattern } from './pattern';
import { type Rarity } from './rarity';
import { type Relic } from './relic';
import { type Spell } from './spell';
import { type SpellTag } from './tag';

export interface ContentModSvg {
  name: string;
}

export interface ContentModImage {
  name: string;
  spritesPerRow: number;
  spriteSize: number;
  framesPerAnimation: number;
}

export interface ContentMod {
  name: string;
  description: string;
  version: string;
  gameVersion: string;
  author: string;

  characters: Record<string, Character>;
  spells: Record<string, Spell>;
  elements: Record<string, SpellElement>;
  spellPatterns: Record<string, SpellPattern>;
  aiPatterns: Record<string, AIPattern>;
  spellTags: Record<string, SpellTag>;
  rarities: Record<string, Rarity>;
  relics: Record<string, Relic>;

  preload: {
    colors: Record<string, string>;
    images: Record<string, ContentModImage>;
    svgs: ContentModSvg[];
  };
}
