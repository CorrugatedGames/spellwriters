import { ActivePlayer } from '../../interfaces';

export function loseCardInHand(player: ActivePlayer, index: number) {
  player.hand.splice(index, 1);
}
