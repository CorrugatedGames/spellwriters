import type { Spritable } from './sprite';

/**
 * @category Modding
 * @category Status Effect
 * @category Mod Data
 */
export interface StatusEffect extends Spritable {
  name: string;
  key: string;
  id: string;
  description: string;
}
