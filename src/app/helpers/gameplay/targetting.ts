import { TurnOrder, type Spell } from '../../interfaces';
import { getSpellPatternImpl } from '../lookup/spell-patterns';
import { getSpellById } from '../lookup/spells';
import { gamestate } from './gamestate';

function getListOfTargettableTilesForSpell(opts: {
  spell: Spell;
  turn: TurnOrder;
}): Array<{ x: number; y: number }> {
  const { spell, turn } = opts;

  const targetableTiles = getRawTargettableTilesForSpell({
    turn,
    spell,
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

function getRawTargettableTilesForSpell(opts: {
  spell: Spell;
  turn: TurnOrder;
}): Record<number, Record<number, boolean>> {
  const { turn, spell } = opts;
  const { field } = gamestate();

  const spellData = getSpellById(spell.id);
  if (!spellData) return {};

  const { depthMin, depthMax } = spellData;
  const height = field.length - 1;

  const targetableTiles: Record<number, Record<number, boolean>> = {};
  field.forEach((row, y) => {
    targetableTiles[y] = targetableTiles[y] || {};

    row.forEach((node, x) => {
      if (
        node.containedElement ||
        node.containedSpell ||
        node.containedStatus
      ) {
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

export function getListOfTargetableTilesForSpellBasedOnPattern(opts: {
  spell: Spell;
  turn: TurnOrder;
}): Array<{ x: number; y: number }> {
  const { spell } = opts;
  if (!spell) return [];

  const allTiles = getListOfTargettableTilesForSpell(opts);

  const pattern = getSpellPatternImpl(spell.pattern);
  if (!pattern) return allTiles;

  const suggestedTiles = pattern.chooseTargetableTiles({
    allTargettableNodes: allTiles,
  });

  return suggestedTiles;
}

export function getListOfTargetableTilesForSpell(opts: {
  spell: Spell;
  turn: TurnOrder;
}): Array<{ x: number; y: number }> {
  const allTiles = getListOfTargettableTilesForSpell(opts);
  const suggestedTiles = getListOfTargetableTilesForSpellBasedOnPattern(opts);
  return suggestedTiles.length > 0 ? suggestedTiles : allTiles;
}
