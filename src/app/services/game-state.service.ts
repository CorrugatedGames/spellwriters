import { Injectable, effect } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { gamestate } from '../helpers';
import { GameState } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  constructor(private localStorage: LocalStorageService) {
    effect(() => {
      this.save(gamestate());
    });
  }

  async init() {
    await this.load();
  }

  startNewCombat(setState: GameState) {
    gamestate.set(setState);
  }

  async load() {
    const state = this.localStorage.retrieve('gamestate');
    if (state) {
      gamestate.set(state);
    }
  }

  async save(saveState: GameState) {
    if (!saveState.id) return;

    this.localStorage.store('gamestate', saveState);
  }
}
