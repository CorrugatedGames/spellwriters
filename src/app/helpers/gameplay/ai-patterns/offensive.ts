import { type AIOpts, type AIPatternImpl, TurnOrder } from '../../../interfaces';
import { getSpellById } from '../../lookup/spells';
import { groupArray, sortArray } from '../../static/array';
import { defaultAIPattern } from '../defaults/ai-patterns';
import { findSpellOnField, findSpellsOnField } from '../field';
import { getListOfTargetableTilesForCard } from '../targetting';
import { handleEntireSpellcastSequence } from '../turn';

function canMakeDecision(opts: AIOpts): boolean {
  return (
    opts.gamestate.spellQueue.filter(
      (spell) =>
        findSpellOnField({ spellId: spell })?.caster === TurnOrder.Player,
    ).length > 0
  );
}

function makeDecision(opts: AIOpts): void {
  const { gamestate, playableCards } = opts;

  const spells = sortArray(playableCards, [
    (card) => -(getSpellById(card.id)?.damage ?? 0),
  ]);

  const chosen = spells[0];
  if (!chosen) return;

  const validTiles = getListOfTargetableTilesForCard({ card: chosen });
  const allSpellsOnField = findSpellsOnField();

  const sortedSpellsByColumn = groupArray(allSpellsOnField, (spell) => spell.x);

  const tilePriorities = sortArray(validTiles, [
    (tile) => sortedSpellsByColumn[tile.x]?.length ?? 0,
    (tile) => -tile.y,
  ]);

  const chosenTile = tilePriorities[0];
  if (!chosenTile) return;

  handleEntireSpellcastSequence({
    x: chosenTile.x,
    y: chosenTile.y,
    character: gamestate.players[gamestate.currentTurn],
    turnOrder: gamestate.currentTurn,
    card: chosen,
    spellQueue: gamestate.spellQueue,
  });
}

export const offensive: AIPatternImpl = {
  ...defaultAIPattern,
  canMakeDecision,
  makeDecision,
};
