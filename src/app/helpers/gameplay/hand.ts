import {
  type CombatActivePlayer,
  type CombatPlayableCard,
} from '../../interfaces';
import { getSpellById } from '../lookup/spells';
import { manaCostForSpell } from './stats';
import { getListOfTargetableTilesForSpell } from './targetting';

/**
 * Lose a hand card for a player. It will be added to the discard pile.
 *
 * @category Gameplay
 * @param opts.player The player losing a card.
 * @param opts.card The card to lose.
 */
export function loseCardInHand(opts: {
  player: CombatActivePlayer;
  card: CombatPlayableCard;
}): void {
  const { player, card } = opts;

  const lostCards = player.hand.splice(player.hand.indexOf(card), 1);
  player.discard.push(...lostCards);
}

/**
 * Get the list of cards a player can play from their hand.
 *
 * @category Gameplay
 * @param opts.player The player to get the playable cards for.
 * @returns the list of playable cards.
 */
export function playableCardsInHand(opts: {
  player: CombatActivePlayer;
}): CombatPlayableCard[] {
  const { player } = opts;

  return player.hand.filter((card) => {
    const spell = getSpellById(card.spellId);
    if (!spell) return false;

    const playableTiles = getListOfTargetableTilesForSpell({
      spell,
      turn: player.turnOrder,
    });
    return (
      playableTiles.length > 0 &&
      manaCostForSpell({ character: player, spell }) <= player.mana
    );
  });
}

/**
 * Check if a player can play any cards from their hand.
 *
 * @category Gameplay
 * @param opts.player The player to check for playable cards.
 * @returns true if the player can play cards from their hand.
 */
export function canPlayCardsInHand(opts: {
  player: CombatActivePlayer;
}): boolean {
  const { player } = opts;
  return playableCardsInHand({ player }).length > 0;
}
