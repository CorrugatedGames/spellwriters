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

export function phaseObjectFromGameState(state: GameState): {
  turn: string;
  phase: GamePhase;
} {
  return {
    turn: state.currentTurn === TurnOrder.Player ? 'Player' : 'Opponent',
    phase: state.currentPhase,
  };
}

export function phaseNameFromGameState(state: GameState): string {
  const { turn, phase } = phaseObjectFromGameState(state);

  return `${turn} ${phase}`;
}

export function stateMachineMapFromGameState(state: GameState): CurrentPhase {
  const { turn, phase } = phaseObjectFromGameState(state);

  return {
    ...createBlankStateMachineMap(),
    [`${turn}${phase}`]: true,
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
    spellsCastThisTurn: 0,
    behaviors: character.behaviors,
  };

  shuffleDeck(player);

  for (let i = 0; i < 3; i++) {
    drawCard(player);
  }

  return player;
}
