import { signal, type Signal, type WritableSignal } from '@angular/core';
import { type GameState, type GameStateInitOpts } from '../../interfaces';
import { createBlankGameState } from './init';

const _gamestate: WritableSignal<GameState> = signal(createBlankGameState());

/**
 * @internal
 */
export const gamestate: Signal<GameState> = _gamestate.asReadonly();

const _debugGamestate: WritableSignal<GameState> = signal(
  createBlankGameState(),
);

/**
 * @internal
 */
export const debugGamestate: Signal<GameState> = _debugGamestate.asReadonly();

/**
 * @internal
 */
export const gamestateInitOptions: WritableSignal<
  GameStateInitOpts | undefined
> = signal(undefined);

/**
 * Save a state as the current game state.
 * You probably don't need to do this, but you might.
 *
 * @category Game State
 */
export function saveGamestate(opts: { state: GameState }): void {
  const { state } = opts;
  _gamestate.set(state);
}

/**
 * Trigger a game state update. This will save the current game state as the current game state.
 * You probably don't need to do this, but you might have to. In those cases, this function is provided.
 * However, using this function in a mod probably means that something internally isn't working as intended, and should probably be reported as a bug.
 *
 * @category Game State
 */
export function triggerGamestateUpdate(): void {
  const currentState = gamestate();
  saveGamestate({ state: { ...currentState } });
}

/**
 * Reset the game state to a blank state.
 *
 * @category Game State
 */
export function resetGamestate(): void {
  _gamestate.set(createBlankGameState());
}

/**
 * Save a state as the current debug game state. A debug state is loaded every time the phase is refreshed. Useful for testing content.
 * You'll probably use `storeCurrentStateAsDebugState` instead.
 *
 * @category Game State
 * @category Debug
 * @param opts.state The state to save as the debug state.
 */
export function saveDebugGamestate(opts: { state: GameState }): void {
  const { state } = opts;
  _debugGamestate.set(state);
}

/**
 * Reset the debug game state to a blank state. Will make it so the debug state is not loaded on phase refresh.
 *
 * @category Game State
 * @category Debug
 */
export function resetDebugGamestate(): void {
  _debugGamestate.set(createBlankGameState());
}

/**
 * Save the current game state as the debug game state. A debug state is loaded every time the phase is refreshed. Useful for testing content.
 *
 * @category Game State
 * @category Debug
 */
export function storeCurrentStateAsDebugState(): void {
  saveDebugGamestate({ state: gamestate() });
}
