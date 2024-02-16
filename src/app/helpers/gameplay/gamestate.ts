import { signal, type Signal, type WritableSignal } from '@angular/core';
import { type GameState, type GameStateInitOpts } from '../../interfaces';
import { createBlankGameState } from './init';

const _gamestate: WritableSignal<GameState> = signal(createBlankGameState());
export const gamestate: Signal<GameState> = _gamestate.asReadonly();

export const gamestateInitOptions: WritableSignal<
  GameStateInitOpts | undefined
> = signal(undefined);

export function saveGamestate(state: GameState): void {
  _gamestate.set(state);
}

export function resetGamestate(): void {
  _gamestate.set(createBlankGameState());
}
