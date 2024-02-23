import { type ActivePlayer, type PlayableCard } from '../../interfaces';
import { getSpellById } from '../lookup/spells';
import { manaCostForSpell } from './stats';
import { getListOfTargetableTilesForSpell } from './targetting';

export function loseCardInHand(opts: {
  player: ActivePlayer;
  card: PlayableCard;
}): void {
  const { player, card } = opts;

  const lostCards = player.hand.splice(player.hand.indexOf(card), 1);
  player.discard.push(...lostCards);
}

export function playableCardsInHand(opts: {
  player: ActivePlayer;
}): PlayableCard[] {
  const { player } = opts;

  return player.hand.filter((card) => {
    const spell = getSpellById(card.spellId);
    if (!spell) return false;

    const playableTiles = getListOfTargetableTilesForSpell({ spell });
    return (
      playableTiles.length > 0 &&
      manaCostForSpell({ character: player, spell }) <= player.mana
    );
  });
}

export function canPlayCardsInHand(opts: { player: ActivePlayer }): boolean {
  const { player } = opts;
  return playableCardsInHand({ player }).length > 0;
}
