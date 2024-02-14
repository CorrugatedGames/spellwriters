import {
  GamePhase,
  GamePlayer,
  TurnOrder,
  type ActivePlayer,
  type Character,
  type CurrentPhase,
  type GameState,
  type PlayableCard,
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

export function phaseObjectFromGameState(opts: { state: GameState }): {
  turn: string;
  phase: GamePhase;
} {
  const { state } = opts;
  return {
    turn: state.currentTurn === TurnOrder.Player ? 'Player' : 'Opponent',
    phase: state.currentPhase,
  };
}

export function phaseNameFromGameState(opts: { state: GameState }): string {
  const { state } = opts;
  const { turn, phase } = phaseObjectFromGameState({ state });

  return `${turn} ${phase}`;
}

export function stateMachineMapFromGameState(opts: {
  state: GameState;
}): CurrentPhase {
  const { state } = opts;
  const { turn, phase } = phaseObjectFromGameState({ state });

  return {
    ...createBlankStateMachineMap(),
    [`${turn}${phase}`]: true,
  };
}

export function turnCardIntoPlayableCard(opts: { id: string }): PlayableCard {
  const { id } = opts;
  return { id };
}

export function turnCharacterIntoActivePlayer(opts: {
  character: Character;
  turnOrder: TurnOrder;
}): ActivePlayer {
  const { character } = opts;
  const deck = character.deck.spells.map((id) =>
    turnCardIntoPlayableCard({ id }),
  );

  const player: ActivePlayer = {
    id: character.id,
    mod: character.mod,
    asset: character.asset,
    sprite: character.sprite,
    turnOrder: opts.turnOrder,
    name: character.name,
    health: character.maxHealth,
    maxHealth: character.maxHealth,
    mana: 1,
    maxMana: 10,
    hand: [],
    deck,
    discard: [],
    spellsCastThisTurn: 0,
    cardsDrawnThisTurn: 0,
    behaviors: character.behaviors,
    relics: character.relics,
  };

  shuffleDeck(player);

  for (let i = 0; i < 3; i++) {
    drawCard(player);
  }

  return player;
}
