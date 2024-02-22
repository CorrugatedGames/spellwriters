import type { ActivePlayer } from '../../interfaces';
import { getStatusEffectByKey } from '../lookup/status-effect';

export function addStatusEffectToPlayer(
  player: ActivePlayer,
  statusEffectKey: string,
  value = 1,
): void {
  const statusEffectId = getStatusEffectByKey(statusEffectKey)?.id;
  if (!statusEffectId) return;

  const setValue = player.statusEffects[statusEffectId] ?? 0;
  player.statusEffects[statusEffectId] = Math.max(0, setValue + value);

  if (player.statusEffects[statusEffectId] === 0) {
    delete player.statusEffects[statusEffectId];
  }
}

export function removeStatusEffectFromPlayer(
  player: ActivePlayer,
  statusEffectKey: string,
  value = 1,
): void {
  addStatusEffectToPlayer(player, statusEffectKey, -value);
}

export function statusEffectStacks(
  player: ActivePlayer,
  statusEffectKey: string,
): number {
  const statusEffectId = getStatusEffectByKey(statusEffectKey)?.id;
  if (!statusEffectId) return -1;

  return player.statusEffects[statusEffectId];
}

export function hasStatusEffect(
  player: ActivePlayer,
  statusEffectKey: string,
): boolean {
  const statusEffectId = getStatusEffectByKey(statusEffectKey)?.id;
  if (!statusEffectId) return false;

  return player.statusEffects[statusEffectId] > 0;
}
