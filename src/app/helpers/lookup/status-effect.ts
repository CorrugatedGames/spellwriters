import { signal, type WritableSignal } from '@angular/core';
import { clone } from 'lodash';
import { type RitualImpl, type StatusEffect } from '../../interfaces';

const AllStatusEffects: Record<string, RitualImpl> = {};

export const statusEffectData: WritableSignal<Record<string, StatusEffect>> =
  signal({});

export function allStatusEffects() {
  return clone(Object.values(statusEffectData()));
}

export function addStatusEffectImpl(key: string, statusEffect: RitualImpl) {
  AllStatusEffects[key] = statusEffect;
}

export function getStatusEffectById(id: string): StatusEffect | undefined {
  const data = statusEffectData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

export function getStatusEffectByKey(key: string): StatusEffect | undefined {
  const data = statusEffectData();
  const id = Object.values(data).find((tag) => tag.key === key)?.id;

  return id ? getStatusEffectById(id) : undefined;
}

export function getStatusEffectByName(name: string): StatusEffect | undefined {
  const data = statusEffectData();
  const id = Object.values(data).find((status) => status.name === name)?.id;
  if (!id) return undefined;

  return getStatusEffectById(id);
}

export function getStatusEffectKey(id: string): string | undefined {
  return getStatusEffectById(id)?.key;
}

export function getStatusEffectImpl(id: string): RitualImpl | undefined {
  if (!id) return undefined;

  const key = getStatusEffectKey(id);
  if (!key) throw new Error(`No status effect exists for ${id}`);

  return AllStatusEffects[key];
}
