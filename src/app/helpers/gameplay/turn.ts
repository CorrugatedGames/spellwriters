import { ActivePlayer } from '../../interfaces';
import { rng } from './rng';

export function shuffleDeck(id: string, character: ActivePlayer): void {
  const prng = rng(id);

  character.deck.sort(() => prng() - 0.5);
}

export function canDrawCard(character: ActivePlayer): boolean {
  return character.deck.length > 0;
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
