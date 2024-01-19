import { WritableSignal, signal } from '@angular/core';
import { GameState } from '../../interfaces';
import { createBlankGameState } from './init';

export const gamestate: WritableSignal<GameState> = signal(
  createBlankGameState(),
);

export function saveGamestate(state: GameState) {
  gamestate.set(state);
}
