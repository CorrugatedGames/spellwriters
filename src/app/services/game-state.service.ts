import { Injectable, effect } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { gamestate, saveGamestate } from '../helpers';
import { GameState } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  constructor(private localStorage: LocalStorageService) {
    effect(() => {
      console.log('[State Update]', gamestate());
      this.save(gamestate());
    });
  }

  async init() {
    await this.load();
  }

  async load() {
    const state = this.localStorage.retrieve('gamestate');
    if (state) {
      saveGamestate(state);
    }
  }

  async save(saveState: GameState) {
    if (!saveState.id) return;

    this.localStorage.store('gamestate', saveState);
  }
}
