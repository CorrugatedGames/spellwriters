import { Injectable, effect, inject, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { createBlankGameState } from '../helpers';
import { gameState, saveGameState } from '../helpers/gameplay/gamestate';
import { type GameState } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private localStorage = inject(LocalStorageService);

  private hasLoaded = signal<boolean>(false);

  private state: GameState = createBlankGameState();

  constructor() {
    effect(() => {
      if (!this.hasLoaded()) return;

      this.state = gameState();
      console.info('[State Update]', this.state);
      this.saveGamestate(this.state);
    });
  }

  async init() {
    this.load();
  }

  load() {
    const state = this.localStorage.retrieve('gamestate');
    if (state) {
      saveGameState({ state });
    }

    this.hasLoaded.set(true);
  }

  saveGamestate(saveState: GameState) {
    this.localStorage.store('gamestate', saveState);
  }
}
