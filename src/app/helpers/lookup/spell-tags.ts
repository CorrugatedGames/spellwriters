import { signal, type WritableSignal } from '@angular/core';
import { type RitualImpl, type SpellTag } from '../../interfaces';

import { clone } from 'lodash';

const AllSpellTags: Record<string, RitualImpl> = {};

export const spellTagData: WritableSignal<Record<string, SpellTag>> = signal(
  {},
);

export function addSpellTagImpl(key: string, tag: RitualImpl) {
  AllSpellTags[key] = tag;
}

export function allSpellTags() {
  return clone(Object.values(spellTagData()));
}

export function getSpellTagById(id: string): SpellTag | undefined {
  const data = spellTagData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

export function getSpellTagByKey(key: string): SpellTag | undefined {
  const data = spellTagData();
  const id = Object.values(data).find((tag) => tag.key === key)?.id;

  return id ? getSpellTagById(id) : undefined;
}

export function getSpellTagKey(id: string): string | undefined {
  return getSpellTagById(id)?.key;
}

export function getSpellTagImplByKey(key: string): RitualImpl | undefined {
  return AllSpellTags[key];
}

export function getSpellTagImpl(id: string): RitualImpl | undefined {
  const key = getSpellTagKey(id);
  if (!key) throw new Error(`No spell tag exists for ${id}`);

  return AllSpellTags[key];
}
