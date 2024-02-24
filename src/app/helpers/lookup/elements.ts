import { signal, type WritableSignal } from '@angular/core';
import {
  type ElementalCollisionImpl,
  type SpellElement,
} from '../../interfaces';

import { clone } from '../static/object';

const AllElementalCollisions: Record<string, ElementalCollisionImpl> = {};

/**
 * @internal
 */
export const elementData: WritableSignal<Record<string, SpellElement>> = signal(
  {},
);

/**
 * @internal
 */
export const elementKeyIds: WritableSignal<Record<string, string>> = signal({});

/**
 * @internal
 */
export function addElementalCollisionImpl(
  key: string,
  collision: ElementalCollisionImpl,
) {
  AllElementalCollisions[key] = collision;
}

/**
 * @internal
 */
export function allElements() {
  return clone(Object.values(elementData()));
}

/**
 * @internal
 */
export function getElementById(id: string): SpellElement | undefined {
  const data = elementData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

/**
 * @internal
 */
export function getElementByName(name: string): SpellElement | undefined {
  const data = elementData();
  const id = Object.values(data).find((element) => element.name === name)?.id;
  if (!id) return undefined;

  return getElementById(id);
}

/**
 * @internal
 */
export function getElementByKey(key: string): SpellElement | undefined {
  const id = getElementIdByKey(key);
  return getElementById(id ?? '');
}

/**
 * @internal
 */
export function getElementKey(id: string): string | undefined {
  return getElementById(id)?.key;
}

/**
 * @internal
 */
export function getElementIdByKey(key: string): string | undefined {
  return elementKeyIds()[key];
}

/**
 * @internal
 */
export function getAllElementalCollisionImpls(): ElementalCollisionImpl[] {
  return Object.values(AllElementalCollisions);
}

/**
 * @internal
 */
export function getElementCollisionImpl(
  id: string,
): ElementalCollisionImpl | undefined {
  if (!id) return undefined;

  const key = getElementKey(id);
  if (!key) throw new Error(`No element collision exists for ${id}`);

  return AllElementalCollisions[key];
}

/**
 * @internal
 */
export function getElementCollisionImplByKey(
  key: string,
): ElementalCollisionImpl | undefined {
  return getElementCollisionImpl(getElementIdByKey(key) ?? '');
}
