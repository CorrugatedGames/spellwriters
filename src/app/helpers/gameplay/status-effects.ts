import type { ActivePlayer } from '../../interfaces';
import { getStatusEffectByKey } from '../lookup/status-effect';

export function addStatusEffectToPlayer(opts: {
  player: ActivePlayer;
  statusEffectKey: string;
  value: number;
}): void {
  const { player, statusEffectKey, value } = opts;

  const statusEffectId = getStatusEffectByKey(statusEffectKey)?.id;
  if (!statusEffectId) return;

  const setValue = player.statusEffects[statusEffectId] ?? 0;
  player.statusEffects[statusEffectId] = Math.max(0, setValue + value);

  if (player.statusEffects[statusEffectId] === 0) {
    delete player.statusEffects[statusEffectId];
  }
}

export function removeStatusEffectFromPlayer(opts: {
  player: ActivePlayer;
  statusEffectKey: string;
  value: number;
}): void {
  const { player, statusEffectKey, value } = opts;
  addStatusEffectToPlayer({ player, statusEffectKey, value: -value });
}

export function statusEffectStacks(opts: {
  player: ActivePlayer;
  statusEffectKey: string;
}): number {
  const { player, statusEffectKey } = opts;

  const statusEffectId = getStatusEffectByKey(statusEffectKey)?.id;
  if (!statusEffectId) return -1;

  return player.statusEffects[statusEffectId];
}

export function hasStatusEffect(opts: {
  player: ActivePlayer;
  statusEffectKey: string;
}): boolean {
  return statusEffectStacks(opts) > 0;
}
