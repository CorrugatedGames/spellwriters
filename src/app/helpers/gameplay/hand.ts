import { ActivePlayer, PlayableCard } from '../../interfaces';
import { getSpellById } from '../lookup/spells';
import { manaCostForSpell } from './stats';
import { getListOfTargetableTilesForCard } from './targetting';

export function loseCardInHand(player: ActivePlayer, card: PlayableCard): void {
  const lostCards = player.hand.splice(player.hand.indexOf(card), 1);
  player.discard.push(...lostCards);
}

export function playableCardsInHand(player: ActivePlayer): PlayableCard[] {
  return player.hand.filter((card) => {
    const playableTiles = getListOfTargetableTilesForCard(card);
    return (
      playableTiles.length > 0 &&
      manaCostForSpell(player, getSpellById(card.id)!) <= player.mana
    );
  });
}

export function canPlayCardsInHand(player: ActivePlayer): boolean {
  return playableCardsInHand(player).length > 0;
}
