import { SpellStat } from '../../interfaces';
import { clone } from '../static/object';

/**
 * @internal
 */
export function allStats() {
  return clone(Object.values(SpellStat));
}
