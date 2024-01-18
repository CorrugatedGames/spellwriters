import { ActivePlayer, Character, PlayableCard } from '../../interfaces';
import { drawCard, shuffleDeck } from './turn';

export function turnCardIntoPlayableCard(id: string): PlayableCard {
  return { id };
}

export function turnCharacterIntoActivePlayer(
  gameId: string,
  character: Character,
): ActivePlayer {
  const deck = character.deck.spells.map((card) =>
    turnCardIntoPlayableCard(card),
  );

  const player: ActivePlayer = {
    id: character.id,
    sprite: character.sprite,
    name: character.name,
    health: character.maxHealth,
    maxHealth: character.maxHealth,
    mana: 1,
    maxMana: 10,
    hand: [],
    deck,
    discard: [],
  };

  shuffleDeck(gameId, player);

  for (let i = 0; i < 3; i++) {
    drawCard(player);
  }

  return player;
}
