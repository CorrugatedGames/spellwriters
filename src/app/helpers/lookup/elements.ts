import { WritableSignal, signal } from '@angular/core';
import { ElementalCollision, SpellElement } from '../../interfaces';

import * as ElementalCollisions from '../gameplay/collisions';

const AllElementalCollisions: Record<string, ElementalCollision> =
  ElementalCollisions;

export const elementData: WritableSignal<Record<string, SpellElement>> = signal(
  {},
);

export const elementKeyIds: WritableSignal<Record<string, string>> = signal({});

export function getElementById(id: string): SpellElement | undefined {
  const data = elementData();
  return data[id];
}

export function getElementByName(name: string): SpellElement | undefined {
  const data = elementData();
  return Object.values(data).find((element) => element.name === name);
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

export function getAllElementalCollisionImpls(): ElementalCollision[] {
  return Object.values(AllElementalCollisions);
}

export function getElementCollisionImpl(
  id: string,
): ElementalCollision | undefined {
  const key = getElementKey(id);
  if (!key) throw new Error(`No element collision exists for ${id}`);

  return AllElementalCollisions[key];
}

export function getElementCollisionImplByKey(
  key: string,
): ElementalCollision | undefined {
  return getElementCollisionImpl(getElementIdByKey(key) ?? '');
}
