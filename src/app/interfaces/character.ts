import { type Spritable } from './sprite';

/**
 * @category Modding
 * @category Character
 * @category Mod Data
 */
export interface Character extends Spritable {
  name: string;
  id: string;
  description: string;
  pickable: boolean;

  maxHealth: number;

  deck: Deck;

  behaviors: Record<string, number>;
  relics: Record<string, number>;
}

/**
 * @category Character
 */
export interface Deck {
  name: string;
  spells: string[];
}
