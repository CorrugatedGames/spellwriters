import { signal, type WritableSignal } from '@angular/core';
import { type Relic, type RitualImpl } from '../../interfaces';
import { clone } from '../static/object';

const AllRelics: Record<string, RitualImpl> = {};

export const relicData: WritableSignal<Record<string, Relic>> = signal({});

export function allRelics() {
  return clone(Object.values(relicData()));
}

export function addRelicImpl(key: string, relic: RitualImpl) {
  AllRelics[key] = relic;
}

export function getRelicById(id: string): Relic | undefined {
  const data = relicData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

export function getRelicKey(id: string): string | undefined {
  return getRelicById(id)?.key;
}

export function getRelicByName(name: string): Relic | undefined {
  const data = relicData();
  const id = Object.values(data).find((relic) => relic.name === name)?.id;
  if (!id) return undefined;

  return getRelicById(id);
}

export function getRelicImpl(id: string): RitualImpl | undefined {
  if (!id) return undefined;

  const key = getRelicKey(id);
  if (!key) throw new Error(`No relic exists for ${id}`);

  return AllRelics[key];
}
