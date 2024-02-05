import { AIPattern } from './ai';
import { Character } from './character';
import { SpellElement } from './element';
import { SpellPattern } from './pattern';
import { Rarity } from './rarity';
import { Spell } from './spell';
import { SpellTag } from './tag';

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
  author: string;

  characters: Record<string, Character>;
  spells: Record<string, Spell>;
  elements: Record<string, SpellElement>;
  spellPatterns: Record<string, SpellPattern>;
  aiPatterns: Record<string, AIPattern>;
  spellTags: Record<string, SpellTag>;
  rarities: Record<string, Rarity>;

  preload: {
    colors: Record<string, string>;
    images: Record<string, ContentModImage>;
    svgs: ContentModSvg[];
  };
}
