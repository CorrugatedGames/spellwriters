import { type WritableSignal, signal } from '@angular/core';
import { type Rarity } from '../../interfaces';

import { clone } from '../static/object';

export const rarityData: WritableSignal<Record<string, Rarity>> = signal({});

export function allRarities() {
  return clone(Object.values(rarityData()));
}

export function getRarityById(id: string): Rarity | undefined {
  const data = rarityData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

export function getRarityByName(name: string): Rarity | undefined {
  const data = rarityData();
  const id = Object.values(data).find((rarity) => rarity.name === name)?.id;
  if (!id) return undefined;

  return getRarityById(id);
}

export function getRarityKey(id: string): string | undefined {
  return getRarityById(id)?.key;
}
