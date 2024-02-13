import { type ContentItem, type SpellPatternImpl } from '../../../interfaces';

export const plainSpellPattern: SpellPatternImpl & ContentItem = {
  __contentType: 'SpellPattern',
  chooseTargetableTiles: () => [],
  getFieldNodesBasedOnTarget: () => [],
};

export const defaultSpellPattern: () => SpellPatternImpl = () => ({
  ...plainSpellPattern,
});
