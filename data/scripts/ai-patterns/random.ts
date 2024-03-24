import { type AIOpts, type AIPatternImpl } from '../../../typings/interfaces';

function canMakeDecision(): boolean {
  return true;
}

function makeDecision(opts: AIOpts): void {
  const { combatstate, playableCards } = opts;

  const chosen = window.api.randomChoice(playableCards);
  if (!chosen) return;

  const chosenSpell = window.api.getSpellById(chosen.spellId);
  if (!chosenSpell) return;

  const validTiles = window.api.getListOfTargetableTilesForSpell({
    spell: chosenSpell,
    turn: 1,
  });
  const chosenTile = window.api.randomChoice(validTiles);
  if (!chosenTile) return;

  window.api.handleEntireSpellcastSequence({
    x: chosenTile.x,
    y: chosenTile.y,
    character: combatstate.players[combatstate.currentTurn],
    turnOrder: combatstate.currentTurn,
    card: chosen,
  });
}

export const random: AIPatternImpl = {
  ...window.api.defaultAIPattern(),
  canMakeDecision,
  makeDecision,
};
