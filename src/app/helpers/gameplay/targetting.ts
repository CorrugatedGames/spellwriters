import { TurnOrder, type Spell } from '../../interfaces';
import { getSpellPatternImpl } from '../lookup/spell-patterns';
import { getSpellById } from '../lookup/spells';
import { getSpaceFromField } from './field';
import { gamestate } from './gamestate';
import { callRitualGlobalFunction } from './ritual';

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

/**
 * Check whether or not a spell can be placed on a particular tile.
 *
 * @param opts
 * @returns
 */
export function canPlaceSpellOnTile(opts: {
  spell: Spell;
  x: number;
  y: number;
}): boolean {
  const { spell, x, y } = opts;

  const tileData = getSpaceFromField({ x, y });
  if (!tileData) return false;

  if (tileData.containedSpell) return false;

  return (
    callRitualGlobalFunction({
      func: 'onSpellPlace',
      funcOpts: { spell, x, y },
    }) as boolean[]
  ).every(Boolean);
}

/**
 * Get a list of valid target tiles for a spell based on the spell's pattern.
 *
 * @category Gameplay
 * @param opts.spell The spell to get valid target tiles for.
 * @param opts.turn The person to get the target tiles for.
 * @returns A list of valid target tiles for the spell.
 */
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
    spell,
    allTargettableNodes: allTiles,
  });

  return suggestedTiles;
}

/**
 * Get a list of valid target tiles for a spell. Will return all possible tiles if there are none suggested by the pattern.
 *
 * @category Gameplay
 * @param opts.spell The spell to get valid target tiles for.
 * @param opts.turn The person to get the target tiles for.
 * @returns A list of valid target tiles for the spell.
 */
export function getListOfTargetableTilesForSpell(opts: {
  spell: Spell;
  turn: TurnOrder;
}): Array<{ x: number; y: number }> {
  const allTiles = getListOfTargettableTilesForSpell(opts);
  const suggestedTiles = getListOfTargetableTilesForSpellBasedOnPattern(opts);
  return suggestedTiles.length > 0 ? suggestedTiles : allTiles;
}
