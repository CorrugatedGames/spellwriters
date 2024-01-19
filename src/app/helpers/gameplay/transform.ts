import {
  ActivePlayer,
  Character,
  CurrentPhase,
  GamePhase,
  GamePlayer,
  GameState,
  PlayableCard,
  TurnOrder,
} from '../../interfaces';
import { drawCard, shuffleDeck } from './turn';

export function createBlankStateMachineMap(): CurrentPhase {
  const keys: Partial<CurrentPhase> = {};

  Object.keys(GamePlayer).forEach((player) => {
    Object.keys(GamePhase).forEach((phase) => {
      keys[`${player as GamePlayer}${phase as GamePhase}`] = false;
    });
  });

  return keys as CurrentPhase;
}

export function stateMachineMapFromGameState(state: GameState): CurrentPhase {
  const playerHalf =
    state.currentTurn === TurnOrder.Player ? 'Player' : 'Opponent';
  const phase = state.currentPhase;

  const keys: CurrentPhase = createBlankStateMachineMap();

  return {
    ...keys,
    [`${playerHalf}${phase}`]: true,
  };
}

export function turnCardIntoPlayableCard(id: string): PlayableCard {
  return { id };
}

export function turnCharacterIntoActivePlayer(
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

  shuffleDeck(player);

  for (let i = 0; i < 3; i++) {
    drawCard(player);
  }

  return player;
}
