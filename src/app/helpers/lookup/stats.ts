import { SpellStat } from '../../interfaces';
import { clone } from '../static/object';

export function allStats() {
  return clone(Object.values(SpellStat));
}
