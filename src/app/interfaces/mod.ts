import { Character } from './character';
import { SpellElement } from './element';
import { Spell } from './spell';

export interface ContentMod {
  name: string;
  description: string;
  version: string;
  author: string;

  characters: Record<string, Character>;
  spells: Record<string, Spell>;
  elements: Record<string, SpellElement>;

  preload: {
    svgs: string[];
  };
}
