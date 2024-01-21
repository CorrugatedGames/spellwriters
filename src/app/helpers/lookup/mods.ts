import { WritableSignal, signal } from '@angular/core';
import { ContentMod } from '../../interfaces';

export const modData: WritableSignal<Record<string, ContentMod>> = signal({});

export function getModById(id: string): ContentMod | undefined {
  const data = modData();
  return data[id];
}
