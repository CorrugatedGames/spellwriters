import { signal, type Signal, type WritableSignal } from '@angular/core';
import { type GameState, type GameStateInitOpts } from '../../interfaces';
import { createBlankGameState } from './init';

const _gamestate: WritableSignal<GameState> = signal(createBlankGameState());
export const gamestate: Signal<GameState> = _gamestate.asReadonly();

const _debugGamestate: WritableSignal<GameState> = signal(
  createBlankGameState(),
);
export const debugGamestate: Signal<GameState> = _debugGamestate.asReadonly();

export const gamestateInitOptions: WritableSignal<
  GameStateInitOpts | undefined
> = signal(undefined);

export function saveGamestate(state: GameState): void {
  _gamestate.set(state);
}

export function resetGamestate(): void {
  _gamestate.set(createBlankGameState());
}

export function saveDebugGamestate(state: GameState): void {
  _debugGamestate.set(state);
}

export function resetDebugGamestate(): void {
  _debugGamestate.set(createBlankGameState());
}

export function storeCurrentStateAsDebugState(): void {
  saveDebugGamestate(gamestate());
}
