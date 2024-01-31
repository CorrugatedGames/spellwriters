import { WritableSignal, signal } from '@angular/core';
import { SpellPattern, SpellPatternImpl } from '../../interfaces';

import * as SpellPatterns from '../gameplay/spell-patterns';

const AllSpellPatterns: Record<string, SpellPatternImpl> = SpellPatterns;

export const spellPatternData: WritableSignal<Record<string, SpellPattern>> =
  signal({});

export function getSpellPatternById(id: string): SpellPattern | undefined {
  const data = spellPatternData();
  return data[id];
}

export function getSpellPatternByName(name: string): SpellPattern | undefined {
  const data = spellPatternData();
  return Object.values(data).find((pattern) => pattern.name === name);
}

export function getSpellPatternKey(id: string): string | undefined {
  return getSpellPatternById(id)?.key;
}

export function getSpellPatternImpl(id: string): SpellPatternImpl | undefined {
  const key = getSpellPatternKey(id);
  if (!key) throw new Error(`No spell pattern exists for ${id}`);

  return AllSpellPatterns[key];
}
