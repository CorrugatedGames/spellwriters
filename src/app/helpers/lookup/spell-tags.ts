import { WritableSignal, signal } from '@angular/core';
import { SpellTag, SpellTagImpl } from '../../interfaces';

import { clone } from 'lodash';
import * as SpellTags from '../gameplay/spell-tags';

const AllSpellTags: Record<string, SpellTagImpl> = SpellTags;

export const spellTagData: WritableSignal<Record<string, SpellTag>> = signal(
  {},
);

export function allSpellTags() {
  return Object.values(spellTagData());
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

export function getSpellTagImpl(id: string): SpellTagImpl | undefined {
  const key = getSpellTagKey(id);
  if (!key) throw new Error(`No spell tag exists for ${id}`);

  return AllSpellTags[key];
}