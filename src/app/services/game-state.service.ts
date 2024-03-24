import { Injectable, effect, inject, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { combatState, createBlankGameState, saveCombatState } from '../helpers';
import { type CombatState, type GameState } from '../interfaces';

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

      this.state = combatState();
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
      saveCombatState({ state });
    }

    this.hasLoaded.set(true);
  }

  saveGamestate(saveState: CombatState) {
    this.localStorage.store('gamestate', saveState);
  }
}
