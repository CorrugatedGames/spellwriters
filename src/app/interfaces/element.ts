import { type CombatTurnOrder } from './gamestate';
import { type Spritable } from './sprite';

/**
 * @category Spell
 */
export interface SpellElementInteraction {
  element: string;
  text: string;
}

/**
 * @category Modding
 * @category Spell
 * @category Mod Data
 */
export interface SpellElement extends Spritable {
  name: string;
  key: string;
  id: string;
  createdBy: string[];
  description: string;
  interactions: SpellElementInteraction[];
}

/**
 * @category Spell
 * @category Field
 */
export interface FieldElement extends SpellElement {
  castId: string;
  caster: CombatTurnOrder;

  extraData: Record<string, unknown>;
}
