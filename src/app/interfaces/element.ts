import { TurnOrder } from './gamestate';

export interface SpellElementInteraction {
  element: string;
  text: string;
}

export interface SpellElement {
  name: string;
  key: string;
  id: string;
  mod: string;
  asset: string;
  color: string;
  createdBy: string[];
  description: string;
  interactions: SpellElementInteraction[];
}

export interface FieldElement extends SpellElement {
  castId: string;
  caster: TurnOrder;
}
