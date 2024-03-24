import type { CombatActivePlayer } from '../../interfaces';
import { getStatusEffectByKey } from '../lookup/status-effect';
import { triggerCombatStateUpdate } from './combatstate';

/**
 * Add a status effect to a player. Will stack it if it already exists.
 *
 * @category Status Effects
 * @param opts.player The player to add the status effect to.
 * @param opts.statusEffectKey The key of the status effect to add.
 * @param opts.value The value to add to the status effect.
 */
export function addStatusEffectToPlayer(opts: {
  player: CombatActivePlayer;
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

  triggerCombatStateUpdate();
}

/**
 * Remove a status effect from a player. Will remove the status effect if it reaches 0.
 *
 * @category Status Effects
 * @param opts.player The player to remove the status effect from.
 * @param opts.statusEffectKey The key of the status effect to remove.
 * @param opts.value The value to remove from the status effect.
 */
export function removeStatusEffectFromPlayer(opts: {
  player: CombatActivePlayer;
  statusEffectKey: string;
  value: number;
}): void {
  const { player, statusEffectKey, value } = opts;
  addStatusEffectToPlayer({ player, statusEffectKey, value: -value });
}

/**
 * Get the number of stacks of a status effect on a player.
 *
 * @category Status Effects
 * @param opts.player The player to check the status effect on.
 * @param opts.statusEffectKey The key of the status effect to check.
 * @returns the number of stacks of the status effect.
 */
export function statusEffectStacks(opts: {
  player: CombatActivePlayer;
  statusEffectKey: string;
}): number {
  const { player, statusEffectKey } = opts;

  const statusEffectId = getStatusEffectByKey(statusEffectKey)?.id;
  if (!statusEffectId) return -1;

  return player.statusEffects[statusEffectId] ?? 0;
}

/**
 * Whether or not a player has a status effect.
 *
 * @category Status Effects
 * @param opts.player The player to check the status effect on.
 * @param opts.statusEffectKey The key of the status effect to check.
 * @returns whether or not the player has the status effect.
 */
export function hasStatusEffect(opts: {
  player: CombatActivePlayer;
  statusEffectKey: string;
}): boolean {
  return statusEffectStacks(opts) > 0;
}
