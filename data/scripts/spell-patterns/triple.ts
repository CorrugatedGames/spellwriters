import type { Spell, SpellPatternImpl } from '../../../typings/interfaces';

function chooseTargetableTiles(opts: {
  spell: Spell;
  allTargettableNodes: Array<{ x: number; y: number }>;
}) {
  const { allTargettableNodes, spell } = opts;
  return allTargettableNodes.filter((node) => {
    return (
      window.api.canPlaceSpellOnTile({ spell, x: node.x - 1, y: node.y }) &&
      window.api.canPlaceSpellOnTile({ spell, x: node.x, y: node.y }) &&
      window.api.canPlaceSpellOnTile({ spell, x: node.x + 1, y: node.y })
    );
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
  ...window.api.defaultSpellPattern(),
  chooseTargetableTiles,
  getFieldNodesBasedOnTarget,
};
