import { type SpellPatternImpl } from '../../../typings/interfaces';

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
  ...window.api.defaultSpellPattern(),
  chooseTargetableTiles,
  getFieldNodesBasedOnTarget,
};
