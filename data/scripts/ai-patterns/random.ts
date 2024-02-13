import { type AIOpts, type AIPatternImpl } from '../../../typings/interfaces';

function canMakeDecision(): boolean {
  return true;
}

function makeDecision(opts: AIOpts): void {
  const { gamestate, playableCards } = opts;

  const chosen = window.api.randomChoice(playableCards);
  if (!chosen) return;

  const validTiles = window.api.getListOfTargetableTilesForCard({
    card: chosen,
  });
  const chosenTile = window.api.randomChoice(validTiles);

  window.api.handleEntireSpellcastSequence({
    x: chosenTile.x,
    y: chosenTile.y,
    character: gamestate.players[gamestate.currentTurn],
    turnOrder: gamestate.currentTurn,
    card: chosen,
    spellQueue: gamestate.spellQueue,
  });
}

export const random: AIPatternImpl = {
  ...window.api.defaultAIPattern(),
  canMakeDecision,
  makeDecision,
};
