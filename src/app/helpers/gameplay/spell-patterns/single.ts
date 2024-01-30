import { SpellPatternImpl } from '../../../interfaces';

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
  chooseTargetableTiles,
  getFieldNodesBasedOnTarget,
};
