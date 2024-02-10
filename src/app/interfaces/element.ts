import { TurnOrder } from './gamestate';
import { Spritable } from './sprite';

export interface SpellElementInteraction {
  element: string;
  text: string;
}

export interface SpellElement extends Spritable {
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
