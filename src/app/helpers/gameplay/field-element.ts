import type {
  CombatTurnOrder,
  FieldElement,
  SpellElement,
} from '../../interfaces';
import { getElementByKey } from '../lookup/elements';
import { getId } from '../static/uuid';
import { combatState } from './combatstate';

/**
 * Convert an element to a field element.
 *
 * @category Field Element
 * @param opts.element The element to convert to a field element.
 * @param opts.caster The caster to be associated with the field element.
 * @param opts.extraData Any extra data to be associated with the field element.
 * @returns {FieldElement} The field element.
 */
export function elementToFieldElement(opts: {
  element: SpellElement;
  caster: CombatTurnOrder;
  extraData?: Record<string, unknown>;
}): FieldElement {
  const { element, caster, extraData } = opts;

  return {
    ...element,
    castId: getId(),
    caster,
    extraData: extraData ?? {},
  };
}

/**
 * Convert an element key to a field element. Primarily used in modding to look up an element by key instead of by a content id.
 *
 * @category Field Element
 * @param opts.elementKey The element key to convert to a field element.
 * @param opts.caster The caster to be associated with the field element.
 * @param opts.extraData Any extra data to be associated with the field element.
 * @returns {FieldElement} The field element.
 */
export function elementKeyToFieldElement(opts: {
  elementKey: string;
  caster: CombatTurnOrder;
  extraData?: Record<string, unknown>;
}): FieldElement {
  const { elementKey, caster, extraData } = opts;

  const element = getElementByKey(elementKey);
  if (!element) throw new Error(`No element for ${elementKey}`);

  return elementToFieldElement({ element, caster, extraData });
}

/**
 * Get the extra data from a field element.
 *
 * @category Field Element
 * @param opts.element The field element to get the data from.
 * @returns {unknown} The data associated with the field element.
 */
export function getExtraDataForFieldElement<T>(opts: {
  element: FieldElement;
  key: string;
}): T {
  const { element, key } = opts;

  return element.extraData[key] as T;
}

/**
 * Set the extra data for a field element.
 *
 * @category Field Element
 * @param opts.element The field element to set the data for.
 * @param opts.key The key to set the data for.
 * @param opts.value The value to set.
 */
export function setExtraDataForFieldElement(opts: {
  element: FieldElement;
  key: string;
  value: unknown;
}): void {
  const { element, key, value } = opts;

  element.extraData[key] = value;
}

/**
 * Clear a field element at a given position.
 *
 * @category Field Element
 * @param opts.x The x position to clear.
 * @param opts.y The y position to clear.
 */
export function clearFieldElement(opts: { x: number; y: number }): void {
  setFieldElement({ x: opts.x, y: opts.y, element: undefined });
}

/**
 * Set the field element at a given position.
 *
 * @category Field Element
 * @param opts.x The x position to set.
 * @param opts.y The y position to set.
 * @param opts.element The element to set. Can be undefined, which will clear the field element.
 * @returns {FieldElement | undefined} The field element at the position.
 */
export function setFieldElement(opts: {
  x: number;
  y: number;
  element: FieldElement | undefined;
}): void {
  const { x, y, element } = opts;
  const { field } = combatState();

  if (!element) {
    field[y][x].containedElement = undefined;
    return;
  }

  field[y][x].containedElement = element;
}
