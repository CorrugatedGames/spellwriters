import { WritableSignal, signal } from '@angular/core';
import { Spell } from '../../interfaces';

export const spellData: WritableSignal<Record<string, Spell>> = signal({});

export function getSpellById(id: string): Spell | undefined {
  const data = spellData();
  return data[id];
}