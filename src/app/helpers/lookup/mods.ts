import { WritableSignal, signal } from '@angular/core';
import { ContentMod } from '../../interfaces';
import { clone } from '../static/object';

export const modData: WritableSignal<Record<string, ContentMod>> = signal({});

export function allMods() {
  return clone(Object.values(modData()));
}

export function getModById(id: string): ContentMod | undefined {
  const data = modData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}
