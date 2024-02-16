import type { FieldElement, SpellElement, TurnOrder } from '../../interfaces';
import { getElementByKey } from '../lookup/elements';
import { getId } from '../static/uuid';
import { gamestate } from './signal';

export function elementToFieldElement(opts: {
  element: SpellElement;
  caster: TurnOrder;
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

export function elementKeyToFieldElement(opts: {
  elementKey: string;
  caster: TurnOrder;
  extraData?: Record<string, unknown>;
}): FieldElement {
  const { elementKey, caster, extraData } = opts;

  const element = getElementByKey(elementKey);
  if (!element) throw new Error(`No element for ${elementKey}`);

  return elementToFieldElement({ element, caster, extraData });
}

export function getExtraDataForFieldElement(opts: {
  element: FieldElement;
  key: string;
}): unknown {
  const { element, key } = opts;

  return element.extraData[key];
}

export function setExtraDataForFieldElement(opts: {
  element: FieldElement;
  key: string;
  value: unknown;
}): void {
  const { element, key, value } = opts;

  element.extraData[key] = value;
}

export function clearFieldElement(opts: { x: number; y: number }): void {
  setFieldElement({ x: opts.x, y: opts.y, element: undefined });
}

export function setFieldElement(opts: {
  x: number;
  y: number;
  element: FieldElement | undefined;
}): void {
  const { x, y, element } = opts;
  const { field } = gamestate();

  if (!element) {
    field[y][x].containedElement = undefined;
    return;
  }

  field[y][x].containedElement = element;
}
