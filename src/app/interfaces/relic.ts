import { type Spritable } from './sprite';

/**
 * @category Modding
 * @category Relic
 * @category Mod Data
 */
export interface Relic extends Spritable {
  name: string;
  id: string;
  key: string;
  description: string;
  rarity: string;
  stackable?: boolean;
}
