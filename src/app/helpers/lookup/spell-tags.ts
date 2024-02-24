import { signal, type WritableSignal } from '@angular/core';
import { type RitualImpl, type SpellTag } from '../../interfaces';

import { clone } from 'lodash';

const AllSpellTags: Record<string, RitualImpl> = {};

/**
 * @internal
 */
export const spellTagData: WritableSignal<Record<string, SpellTag>> = signal(
  {},
);

/**
 * @internal
 */
export function addSpellTagImpl(key: string, tag: RitualImpl) {
  AllSpellTags[key] = tag;
}

/**
 * @internal
 */
export function allSpellTags() {
  return clone(Object.values(spellTagData()));
}

/**
 * @internal
 */
export function getSpellTagById(id: string): SpellTag | undefined {
  const data = spellTagData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

/**
 * @internal
 */
export function getSpellTagByKey(key: string): SpellTag | undefined {
  const data = spellTagData();
  const id = Object.values(data).find((tag) => tag.key === key)?.id;

  return id ? getSpellTagById(id) : undefined;
}

/**
 * @internal
 */
export function getSpellTagKey(id: string): string | undefined {
  return getSpellTagById(id)?.key;
}

/**
 * @internal
 */
export function getSpellTagImplByKey(key: string): RitualImpl | undefined {
  return AllSpellTags[key];
}

/**
 * @internal
 */
export function getSpellTagImpl(id: string): RitualImpl | undefined {
  const key = getSpellTagKey(id);
  if (!key) throw new Error(`No spell tag exists for ${id}`);

  return AllSpellTags[key];
}
