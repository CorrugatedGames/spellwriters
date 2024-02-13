import { signal, type WritableSignal } from '@angular/core';
import {
  type ElementalCollisionImpl,
  type SpellElement,
} from '../../interfaces';

import { clone } from '../static/object';

const AllElementalCollisions: Record<string, ElementalCollisionImpl> = {};

export const elementData: WritableSignal<Record<string, SpellElement>> = signal(
  {},
);

export const elementKeyIds: WritableSignal<Record<string, string>> = signal({});

export function addElementalCollisionImpl(
  key: string,
  collision: ElementalCollisionImpl,
) {
  AllElementalCollisions[key] = collision;
}

export function allElements() {
  return clone(Object.values(elementData()));
}

export function getElementById(id: string): SpellElement | undefined {
  const data = elementData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

export function getElementByName(name: string): SpellElement | undefined {
  const data = elementData();
  const id = Object.values(data).find((element) => element.name === name)?.id;
  if (!id) return undefined;

  return getElementById(id);
}

export function getElementByKey(key: string): SpellElement | undefined {
  const id = getElementIdByKey(key);
  return getElementById(id ?? '');
}

export function getElementKey(id: string): string | undefined {
  return getElementById(id)?.key;
}

export function getElementIdByKey(key: string): string | undefined {
  return elementKeyIds()[key];
}

export function getAllElementalCollisionImpls(): ElementalCollisionImpl[] {
  return Object.values(AllElementalCollisions);
}

export function getElementCollisionImpl(
  id: string,
): ElementalCollisionImpl | undefined {
  if (!id) return undefined;

  const key = getElementKey(id);
  if (!key) throw new Error(`No element collision exists for ${id}`);

  return AllElementalCollisions[key];
}

export function getElementCollisionImplByKey(
  key: string,
): ElementalCollisionImpl | undefined {
  return getElementCollisionImpl(getElementIdByKey(key) ?? '');
}
