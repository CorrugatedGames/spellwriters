import { FieldNode, PlayableCard, TurnOrder } from '../../interfaces';
import { getSpellById } from '../lookup/spells';

export function chooseTargetableTilesForCard(
  field: FieldNode[][],
  turn: TurnOrder,
  card: PlayableCard,
): Record<number, Record<number, boolean>> {
  const spellData = getSpellById(card.id);
  if (!spellData) return {};

  const { depthMin, depthMax } = spellData;
  const height = field.length - 1;

  const targetableTiles: Record<number, Record<number, boolean>> = {};

  field.forEach((row, y) => {
    targetableTiles[y] = targetableTiles[y] || {};

    row.forEach((node, x) => {
      if (node.containedEffect || node.containedSpell) {
        return;
      }

      if (turn === TurnOrder.Opponent) {
        if (y < depthMin) return;
        if (y > depthMax) return;
      }

      if (turn === TurnOrder.Player) {
        if (y < height - depthMax) return;
        if (y > height - depthMin) return;
      }

      targetableTiles[y][x] = true;
    });
  });

  return targetableTiles;
}
