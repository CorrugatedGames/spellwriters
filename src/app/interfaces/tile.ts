import type { TurnOrder } from './gamestate';
import type { Spritable } from './sprite';

export interface TileStatus extends Spritable {
  name: string;
  key: string;
  id: string;
  description: string;
}

export interface FieldStatus extends TileStatus {
  castId: string;
  caster: TurnOrder;

  extraData: Record<string, unknown>;
}
