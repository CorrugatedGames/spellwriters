import { type AIOpts, type AIPatternImpl } from '../../../typings/interfaces';

function canMakeDecision(opts: AIOpts): boolean {
  return (
    opts.gamestate.spellQueue.filter(
      (spell) => window.api.findSpellOnField({ spellId: spell })?.caster === 0,
    ).length > 0
  );
}

function makeDecision(opts: AIOpts): void {
  const { gamestate, playableCards } = opts;

  const spells = window.api.sortArray(playableCards, [
    (card) => -(window.api.getSpellById(card.id)?.damage ?? 0),
  ]);

  const chosen = spells[0];
  if (!chosen) return;

  const validTiles = window.api.getListOfTargetableTilesForCard({
    card: chosen,
  });
  const allSpellsOnField = window.api.findSpellsOnField();

  const sortedSpellsByColumn = window.api.groupArray(
    allSpellsOnField,
    (spell) => spell.x,
  );

  const tilePriorities = window.api.sortArray(validTiles, [
    (tile) => sortedSpellsByColumn[tile.x]?.length ?? 0,
    (tile) => -tile.y,
  ]);

  const chosenTile = tilePriorities[0];
  if (!chosenTile) return;

  window.api.handleEntireSpellcastSequence({
    x: chosenTile.x,
    y: chosenTile.y,
    character: gamestate.players[gamestate.currentTurn],
    turnOrder: gamestate.currentTurn,
    card: chosen,
    spellQueue: gamestate.spellQueue,
  });
}

export const offensive: AIPatternImpl = {
  ...window.api.defaultAIPattern(),
  canMakeDecision,
  makeDecision,
};
