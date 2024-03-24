import type { CombatActivePlayer, CombatTurnOrder } from '../../interfaces';
import { combatState } from './combatstate';

/**
 * Get an ActivePlayer reference by their position in the turn order.
 *
 * @category Player
 * @param opts.turnOrder the {TurnOrder} to get the active player from
 * @returns the active player reference
 */
export function getActivePlayerByTurnOrder(opts: {
  turnOrder: CombatTurnOrder;
}): CombatActivePlayer {
  const state = combatState();
  const { turnOrder } = opts;

  return state.players[turnOrder];
}
