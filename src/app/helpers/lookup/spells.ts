import { signal, type WritableSignal } from '@angular/core';
import { clone } from 'lodash';
import { type RitualImpl, type Spell } from '../../interfaces';

const AllSpells: Record<string, RitualImpl> = {};

export const spellData: WritableSignal<Record<string, Spell>> = signal({});

export function allSpells() {
  return clone(Object.values(spellData()));
}

export function addSpellImpl(key: string, spell: RitualImpl) {
  AllSpells[key] = spell;
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

export function getSpellKey(id: string): string | undefined {
  return getSpellById(id)?.key;
}

export function getSpellImpl(id: string): RitualImpl | undefined {
  if (!id) return undefined;

  const key = getSpellKey(id);
  if (!key) throw new Error(`No spell exists for ${id}`);

  return AllSpells[key];
}
