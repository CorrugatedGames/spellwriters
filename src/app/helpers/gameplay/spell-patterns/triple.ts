import { type SpellPatternImpl } from '../../../interfaces';
import { defaultSpellPattern } from '../defaults/spell-patterns';
import { getSpaceFromField } from '../field';

function chooseTargetableTiles(opts: {
  allTargettableNodes: Array<{ x: number; y: number }>;
}) {
  const { allTargettableNodes } = opts;
  return allTargettableNodes.filter((node) => {
    const leftNode = getSpaceFromField({ x: node.x - 1, y: node.y });
    if (!leftNode) return false;

    const rightNode = getSpaceFromField({ x: node.x + 1, y: node.y });
    if (!rightNode) return false;

    return !leftNode.containedSpell && !rightNode.containedSpell;
  });
}

function getFieldNodesBasedOnTarget(opts: { x: number; y: number }) {
  const { x, y } = opts;
  return [
    { x: x - 1, y },
    { x, y },
    { x: x + 1, y },
  ];
}

export const triple: SpellPatternImpl = {
  ...defaultSpellPattern,
  chooseTargetableTiles,
  getFieldNodesBasedOnTarget,
};
