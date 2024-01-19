import { ActivePlayer, GamePhase } from '../../interfaces';
import { nextPhase } from './meta';
import { seededrng } from './rng';
import { gamestate } from './signal';

export function shuffleDeck(character: ActivePlayer): void {
  const prng = seededrng();

  character.deck.sort(() => prng() - 0.5);
}

export function reshuffleDeck(character: ActivePlayer): void {
  character.deck.push(...character.discard);
  character.discard = [];

  shuffleDeck(character);
}

export function canDrawCard(character: ActivePlayer): boolean {
  const state = gamestate();

  return state.currentPhase === GamePhase.Draw && character.deck.length > 0;
}

export function drawCard(character: ActivePlayer): void {
  if (!canDrawCard(character)) {
    return;
  }

  const card = character.deck.pop();

  if (card) {
    character.hand.push(card);
  }
}

export function drawCardAndPassPhase(character: ActivePlayer): void {
  drawCard(character);
  nextPhase();
}

export function endTurnAndPassPhase(): void {
  nextPhase();
}
