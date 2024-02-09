export interface Relic {
  name: string;
  id: string;
  key: string;
  description: string;
  rarity: string;
  stackable?: boolean;

  mod: string;
  asset: string;
  sprite: number;
}
