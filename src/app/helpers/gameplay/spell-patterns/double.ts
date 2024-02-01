import { SpellPatternImpl } from '../../../interfaces';
import { defaultSpellPattern } from '../defaults/spell-patterns';
import { getSpaceFromField } from '../field';

function chooseTargetableTiles(opts: {
  allTargettableNodes: Array<{ x: number; y: number }>;
}) {
  const { allTargettableNodes } = opts;
  return allTargettableNodes.filter((node) => {
    const rightNode = getSpaceFromField({ x: node.x + 1, y: node.y });
    if (!rightNode) return false;

    return !rightNode.containedSpell;
  });
}

function getFieldNodesBasedOnTarget(opts: { x: number; y: number }) {
  const { x, y } = opts;
  return [
    { x, y },
    { x: x + 1, y },
  ];
}

export const double: SpellPatternImpl = {
  ...defaultSpellPattern,
  chooseTargetableTiles,
  getFieldNodesBasedOnTarget,
};
