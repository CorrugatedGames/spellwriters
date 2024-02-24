import { signal, type WritableSignal } from '@angular/core';
import { type SpellPattern, type SpellPatternImpl } from '../../interfaces';

import { clone } from '../static/object';

const AllSpellPatterns: Record<string, SpellPatternImpl> = {};

/**
 * @internal
 */
export const spellPatternData: WritableSignal<Record<string, SpellPattern>> =
  signal({});

/**
 * @internal
 */
export function allSpellPatterns() {
  return clone(Object.values(spellPatternData()));
}

/**
 * @internal
 */
export function addSpellPatternImpl(key: string, pattern: SpellPatternImpl) {
  AllSpellPatterns[key] = pattern;
}

/**
 * @internal
 */
export function getSpellPatternById(id: string): SpellPattern | undefined {
  const data = spellPatternData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

/**
 * @internal
 */
export function getSpellPatternByName(name: string): SpellPattern | undefined {
  const data = spellPatternData();
  const id = Object.values(data).find((pattern) => pattern.name === name)?.id;
  if (!id) return undefined;

  return getSpellPatternById(id);
}

/**
 * @internal
 */
export function getSpellPatternKey(id: string): string | undefined {
  return getSpellPatternById(id)?.key;
}

/**
 * @internal
 */
export function getSpellPatternImpl(id: string): SpellPatternImpl | undefined {
  if (!id) return undefined;

  const key = getSpellPatternKey(id);
  if (!key) throw new Error(`No spell pattern exists for ${id}`);

  return AllSpellPatterns[key];
}
