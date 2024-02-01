import { WritableSignal, signal } from '@angular/core';
import { SpellTag, SpellTagImpl } from '../../interfaces';

import * as SpellTags from '../gameplay/spell-tags';

const AllSpellTags: Record<string, SpellTagImpl> = SpellTags;

export const spellTagData: WritableSignal<Record<string, SpellTag>> = signal(
  {},
);

export function getSpellTagById(id: string): SpellTag | undefined {
  const data = spellTagData();
  return data[id];
}

export function getSpellTagByKey(key: string): SpellTag | undefined {
  const data = spellTagData();
  return Object.values(data).find((tag) => tag.key === key);
}

export function getSpellTagKey(id: string): string | undefined {
  return getSpellTagById(id)?.key;
}

export function getSpellTagImpl(id: string): SpellTagImpl | undefined {
  const key = getSpellTagKey(id);
  if (!key) throw new Error(`No spell tag exists for ${id}`);

  return AllSpellTags[key];
}
