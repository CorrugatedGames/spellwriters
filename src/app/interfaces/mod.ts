import { Character } from './archetype';
import { Spell } from './spell';

export interface ContentMod {
  name: string;
  description: string;
  version: string;
  author: string;

  characters: Record<string, Character>;
  spells: Record<string, Spell>;
}
