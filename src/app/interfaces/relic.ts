import { type Spritable } from './sprite';

export interface Relic extends Spritable {
  name: string;
  id: string;
  key: string;
  description: string;
  rarity: string;
  stackable?: boolean;
}
