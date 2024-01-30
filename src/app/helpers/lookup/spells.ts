import { WritableSignal, signal } from '@angular/core';
import { Spell } from '../../interfaces';

export const spellData: WritableSignal<Record<string, Spell>> = signal({});

export function getSpellById(id: string): Spell | undefined {
  const data = spellData();
  return data[id];
}

export function getSpellByName(name: string): Spell | undefined {
  const data = spellData();
  return Object.values(data).find((spell) => spell.name === name);
}
