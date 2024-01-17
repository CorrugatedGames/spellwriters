import { WritableSignal, signal } from '@angular/core';
import { GameState } from '../../interfaces';
import { createBlankGameState } from './init';

export const gamestate: WritableSignal<GameState> = signal(
  createBlankGameState(),
);
