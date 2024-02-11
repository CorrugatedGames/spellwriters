import { type Spritable } from './sprite';

export interface Character extends Spritable {
  name: string;
  id: string;
  description: string;

  maxHealth: number;

  deck: Deck;

  behaviors: Record<string, number>;
  relics: Record<string, number>;
}

export interface Deck {
  name: string;
  spells: string[];
}
