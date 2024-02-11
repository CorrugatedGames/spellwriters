import { type SpellPatternImpl } from '../../../interfaces';
import { defaultSpellPattern } from '../defaults/spell-patterns';

function chooseTargetableTiles(opts: {
  allTargettableNodes: Array<{ x: number; y: number }>;
}) {
  const { allTargettableNodes } = opts;
  return allTargettableNodes;
}

function getFieldNodesBasedOnTarget(opts: { x: number; y: number }) {
  const { x, y } = opts;
  return [{ x, y }];
}

export const single: SpellPatternImpl = {
  ...defaultSpellPattern,
  chooseTargetableTiles,
  getFieldNodesBasedOnTarget,
};
