import { PlayableCard, TurnOrder } from '../../interfaces';
import { getPatternImpl } from '../lookup/patterns';
import { getSpellById } from '../lookup/spells';
import { gamestate } from './signal';

export function getTargetableTilesForCard(opts: {
  turn: TurnOrder;
  card: PlayableCard;
}): Record<number, Record<number, boolean>> {
  const { turn, card } = opts;
  const { field } = gamestate();

  const spellData = getSpellById(card.id);
  if (!spellData) return {};

  const { depthMin, depthMax } = spellData;
  const height = field.length - 1;

  const targetableTiles: Record<number, Record<number, boolean>> = {};

  field.forEach((row, y) => {
    targetableTiles[y] = targetableTiles[y] || {};

    row.forEach((node, x) => {
      if (node.containedElement || node.containedSpell) {
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

export function getAllTargettableTilesForCard(opts: {
  card: PlayableCard;
}): Array<{ x: number; y: number }> {
  const { card } = opts;

  const targetableTiles = getTargetableTilesForCard({
    turn: TurnOrder.Opponent,
    card,
  });

  const tiles: Array<{ x: number; y: number }> = [];

  Object.keys(targetableTiles).forEach((y) => {
    Object.keys(targetableTiles[+y]).forEach((x) => {
      if (!targetableTiles[+y][+x]) return;
      tiles.push({ x: +x, y: +y });
    });
  });

  return tiles;
}

export function getListOfSuggestedTargetableTilesForCard(opts: {
  card: PlayableCard;
}): Array<{ x: number; y: number }> {
  const { card } = opts;
  const spell = getSpellById(card.id);
  if (!spell) return [];

  const allTiles = getAllTargettableTilesForCard(opts);

  const pattern = getPatternImpl(spell.pattern);
  console.log(spell.name, pattern);
  if (!pattern) return allTiles;

  const suggestedTiles = pattern.chooseTargetableTiles({
    allTargettableNodes: allTiles,
  });

  return suggestedTiles.length > 0 ? suggestedTiles : allTiles;
}

export function getListOfTargetableTilesForCard(opts: {
  card: PlayableCard;
  alwaysReturnAllTiles?: boolean;
}): Array<{ x: number; y: number }> {
  const allTiles = getAllTargettableTilesForCard(opts);
  if (opts.alwaysReturnAllTiles) return allTiles;

  const suggestedTiles = getListOfSuggestedTargetableTilesForCard(opts);
  return suggestedTiles.length > 0 ? suggestedTiles : allTiles;
}
