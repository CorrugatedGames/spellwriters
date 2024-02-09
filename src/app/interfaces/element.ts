import { TurnOrder } from './gamestate';
import { ModAssetable } from './sprite';

export interface SpellElementInteraction {
  element: string;
  text: string;
}

export interface SpellElement extends ModAssetable {
  name: string;
  key: string;
  id: string;
  createdBy: string[];
  description: string;
  interactions: SpellElementInteraction[];
}

export interface FieldElement extends SpellElement {
  castId: string;
  caster: TurnOrder;
}
