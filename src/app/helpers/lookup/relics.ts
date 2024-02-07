import { WritableSignal, signal } from '@angular/core';
import { Relic } from '../../interfaces';
import { clone } from '../static/object';

export const relicData: WritableSignal<Record<string, Relic>> = signal({});

export function allRelics() {
  return clone(Object.values(relicData()));
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
