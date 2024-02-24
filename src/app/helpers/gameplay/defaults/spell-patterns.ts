import { type ContentItem, type SpellPatternImpl } from '../../../interfaces';

/**
 * The default Spell Pattern.
 *
 * @category Spell
 * @category Content Item
 */
export const plainSpellPattern: SpellPatternImpl & ContentItem = {
  __contentType: 'SpellPattern',
  chooseTargetableTiles: () => [],
  getFieldNodesBasedOnTarget: () => [],
};

/**
 * The default Spell Pattern.
 *
 * @category Spell
 * @category Content Item
 *
 * @returns The default Spell Pattern.
 */
export const defaultSpellPattern: () => SpellPatternImpl = () => ({
  ...plainSpellPattern,
});
