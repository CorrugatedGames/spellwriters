import { WritableSignal, signal } from '@angular/core';
import { SpellPattern, SpellPatternImpl } from '../../interfaces';

import * as SpellPatterns from '../gameplay/spell-patterns';

const AllSpellPatterns: Record<string, SpellPatternImpl> = SpellPatterns;

export const patternData: WritableSignal<Record<string, SpellPattern>> = signal(
  {},
);

export function getPatternById(id: string): SpellPattern | undefined {
  const data = patternData();
  return data[id];
}

export function getPatternByName(name: string): SpellPattern | undefined {
  const data = patternData();
  return Object.values(data).find((pattern) => pattern.name === name);
}

export function getPatternKey(id: string): string | undefined {
  return getPatternById(id)?.key;
}

export function getPatternImpl(id: string): SpellPatternImpl | undefined {
  const key = getPatternKey(id);
  if (!key) throw new Error(`No pattern exists for ${id}`);

  return AllSpellPatterns[key];
}
