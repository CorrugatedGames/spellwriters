import { ActivePlayer } from '../../interfaces';

export function loseCardInHand(player: ActivePlayer, index: number): void {
  const lostCards = player.hand.splice(index, 1);
  player.discard.push(...lostCards);
}
