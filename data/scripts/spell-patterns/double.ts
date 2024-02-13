import type { SpellPatternImpl } from '../../../typings/interfaces';

function chooseTargetableTiles(opts: {
  allTargettableNodes: Array<{ x: number; y: number }>;
}) {
  const { allTargettableNodes } = opts;
  return allTargettableNodes.filter((node) => {
    const rightNode = window.api.getSpaceFromField({
      x: node.x + 1,
      y: node.y,
    });
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
  ...window.api.defaultSpellPattern(),
  chooseTargetableTiles,
  getFieldNodesBasedOnTarget,
};
