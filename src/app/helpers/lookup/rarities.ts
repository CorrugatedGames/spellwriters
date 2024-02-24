import { signal, type WritableSignal } from '@angular/core';
import { type Rarity } from '../../interfaces';

import { clone } from '../static/object';

/**
 * @internal
 */
export const rarityData: WritableSignal<Record<string, Rarity>> = signal({});

/**
 * @internal
 */
export function allRarities() {
  return clone(Object.values(rarityData()));
}

/**
 * @internal
 */
export function getRarityById(id: string): Rarity | undefined {
  const data = rarityData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

/**
 * @internal
 */
export function getRarityByName(name: string): Rarity | undefined {
  const data = rarityData();
  const id = Object.values(data).find((rarity) => rarity.name === name)?.id;
  if (!id) return undefined;

  return getRarityById(id);
}

/**
 * @internal
 */
export function getRarityKey(id: string): string | undefined {
  return getRarityById(id)?.key;
}
