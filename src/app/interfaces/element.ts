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
