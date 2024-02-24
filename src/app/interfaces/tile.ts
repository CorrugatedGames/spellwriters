import type { TurnOrder } from './gamestate';
import type { Spritable } from './sprite';

/**
 * @category Modding
 * @category Tile Status
 * @category Mod Data
 */
export interface TileStatus extends Spritable {
  name: string;
  key: string;
  id: string;
  description: string;
}

/**
 * @category Tile Status
 * @category Field
 */
export interface FieldStatus extends TileStatus {
  castId: string;
  caster: TurnOrder;

  extraData: Record<string, unknown>;
}
