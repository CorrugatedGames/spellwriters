import { signal, type WritableSignal } from '@angular/core';
import { clone } from 'lodash';
import { type RitualImpl, type StatusEffect } from '../../interfaces';

const AllStatusEffects: Record<string, RitualImpl> = {};

/**
 * @internal
 */
export const statusEffectData: WritableSignal<Record<string, StatusEffect>> =
  signal({});

/**
 * @internal
 */
export function allStatusEffects() {
  return clone(Object.values(statusEffectData()));
}

/**
 * @internal
 */
export function addStatusEffectImpl(key: string, statusEffect: RitualImpl) {
  AllStatusEffects[key] = statusEffect;
}

/**
 * @internal
 */
export function getStatusEffectById(id: string): StatusEffect | undefined {
  const data = statusEffectData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

/**
 * @internal
 */
export function getStatusEffectByKey(key: string): StatusEffect | undefined {
  const data = statusEffectData();
  const id = Object.values(data).find((tag) => tag.key === key)?.id;

  return id ? getStatusEffectById(id) : undefined;
}

/**
 * @internal
 */
export function getStatusEffectByName(name: string): StatusEffect | undefined {
  const data = statusEffectData();
  const id = Object.values(data).find((status) => status.name === name)?.id;
  if (!id) return undefined;

  return getStatusEffectById(id);
}

/**
 * @internal
 */
export function getStatusEffectKey(id: string): string | undefined {
  return getStatusEffectById(id)?.key;
}

/**
 * @internal
 */
export function getStatusEffectImpl(id: string): RitualImpl | undefined {
  if (!id) return undefined;

  const key = getStatusEffectKey(id);
  if (!key) throw new Error(`No status effect exists for ${id}`);

  return AllStatusEffects[key];
}
