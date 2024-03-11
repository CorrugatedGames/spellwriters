import type { ActivePlayer, TurnOrder } from '../../interfaces';
import { gamestate } from './gamestate';

/**
 * Get an ActivePlayer reference by their position in the turn order.
 *
 * @category Player
 * @param opts.turnOrder the {TurnOrder} to get the active player from
 * @returns the active player reference
 */
export function getActivePlayerByTurnOrder(opts: {
  turnOrder: TurnOrder;
}): ActivePlayer {
  const state = gamestate();
  const { turnOrder } = opts;

  return state.players[turnOrder];
}
