import { type SpellPatternImpl } from '../../../interfaces';

export const plainSpellPattern: SpellPatternImpl = {
  chooseTargetableTiles: () => [],
  getFieldNodesBasedOnTarget: () => [],
};

export const defaultSpellPattern: () => SpellPatternImpl = () => ({
  ...plainSpellPattern,
});
