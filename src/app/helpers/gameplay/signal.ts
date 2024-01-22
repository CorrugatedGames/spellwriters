import { WritableSignal, signal } from '@angular/core';
import { GameState, GameStateInitOpts } from '../../interfaces';
import { createBlankGameState } from './init';

export const gamestate: WritableSignal<GameState> = signal(
  createBlankGameState(),
);

export const gamestateInitOptions: WritableSignal<
  GameStateInitOpts | undefined
> = signal(undefined);

export function saveGamestate(state: GameState): void {
  gamestate.set(state);
}

export function resetGamestate(): void {
  gamestate.set(createBlankGameState());
}
