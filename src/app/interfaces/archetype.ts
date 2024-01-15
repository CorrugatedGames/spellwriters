export interface Character {
  name: string;
  id: string;
  description: string;

  mod: string;
  asset: string;
  sprite: number;

  maxHealth: number;

  deck: Deck;
}

export interface Deck {
  name: string;
  spells: string[];
}

export interface Combatant {
  name: string;
  sprite: number;

  maxHealth: number;
  currentHealth: number;

  deck: Deck;
}