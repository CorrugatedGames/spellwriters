import { signal, type Signal, type WritableSignal } from '@angular/core';
import { type GameState } from '../../interfaces';
import { createBlankGameState } from './init';

const _gamestate: WritableSignal<GameState> = signal(createBlankGameState());

/**
 * @internal
 */
export const gamestate: Signal<GameState> = _gamestate.asReadonly();

/**
 * Save a state as the current game state.
 * You probably don't need to do this, but you might.
 *
 * @category Game State
 */
export function saveGameState(opts: { state: GameState }): void {
  const { state } = opts;
  _gamestate.set(state);
}

/**
 * Reset the game state to a blank state.
 *
 * @category Game State
 */
export function resetGamestate(): void {
  _gamestate.set(createBlankGameState());
}
