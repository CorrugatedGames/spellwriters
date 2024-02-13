import { type AIOpts, type AIPatternImpl } from '../../../interfaces';
import { randomChoice } from '../../static/rng';
import { defaultAIPattern } from '../defaults/ai-patterns';
import { getListOfTargetableTilesForCard } from '../targetting';
import { handleEntireSpellcastSequence } from '../turn';

function canMakeDecision(): boolean {
  return true;
}

function makeDecision(opts: AIOpts): void {
  const { gamestate, playableCards } = opts;

  const chosen = randomChoice(playableCards);
  if (!chosen) return;

  const validTiles = getListOfTargetableTilesForCard({ card: chosen });
  const chosenTile = randomChoice(validTiles);

  handleEntireSpellcastSequence({
    x: chosenTile.x,
    y: chosenTile.y,
    character: gamestate.players[gamestate.currentTurn],
    turnOrder: gamestate.currentTurn,
    card: chosen,
    spellQueue: gamestate.spellQueue,
  });
}

export const random: AIPatternImpl = {
  ...defaultAIPattern(),
  canMakeDecision,
  makeDecision,
};
