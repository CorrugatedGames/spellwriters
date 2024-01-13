export interface Archetype {
  name: string;
  description: string;
  sprite: number;

  maxHealth: number;

  deck: Deck;
}

export interface Deck {
  name: string;
  spells: string[];
}

export interface CombatantArchetype {
  name: string;
  sprite: number;

  maxHealth: number;
  currentHealth: number;

  deck: Deck;
}
