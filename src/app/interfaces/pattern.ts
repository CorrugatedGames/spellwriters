import type { ContentItem } from './content';
import type { Spell } from './spell';

/**
 * @category Modding
 * @category Spell
 * @category Mod Data
 */
export interface SpellPattern {
  name: string;
  id: string;
  key: string;
}

/**
 * @category Modding
 * @category Spell
 */
export interface SpellPatternImpl extends ContentItem {
  chooseTargetableTiles(opts: {
    spell: Spell;
    allTargettableNodes: Array<{ x: number; y: number }>;
  }): Array<{ x: number; y: number }>;

  getFieldNodesBasedOnTarget(opts: {
    x: number;
    y: number;
  }): Array<{ x: number; y: number }>;
}
