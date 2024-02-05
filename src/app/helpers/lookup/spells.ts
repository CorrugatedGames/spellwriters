import { WritableSignal, signal } from '@angular/core';
import { clone } from 'lodash';
import { Spell } from '../../interfaces';

export const spellData: WritableSignal<Record<string, Spell>> = signal({});

export function allSpells() {
  return Object.values(spellData());
}

export function getSpellById(id: string): Spell | undefined {
  const data = spellData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

export function getSpellByName(name: string): Spell | undefined {
  const data = spellData();
  const id = Object.values(data).find((spell) => spell.name === name)?.id;
  if (!id) return undefined;

  return getSpellById(id);
}
