import { Injectable, effect } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { interval } from 'rxjs';
import {
  aiAttemptAction,
  createBlankGameState,
  gamestate,
  nextPhase,
  saveGamestate,
} from '../helpers';
import { GamePhase, GameState, TurnOrder } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private state: GameState = createBlankGameState();

  constructor(private localStorage: LocalStorageService) {
    effect(() => {
      this.state = gamestate();
      console.log('[State Update]', this.state);
      this.save(this.state);
    });
  }

  async init() {
    this.load();
    this.loop();
  }

  load() {
    const state = this.localStorage.retrieve('gamestate');
    if (state) {
      saveGamestate(state);
    }
  }

  save(saveState: GameState) {
    if (!saveState.id) return;

    this.localStorage.store('gamestate', saveState);
  }

  loop() {
    interval(1000).subscribe(() => {
      if (this.state.currentPhase === GamePhase.End) {
        nextPhase();
        return;
      }

      if (this.state.currentTurn === TurnOrder.Opponent) {
        aiAttemptAction();
      }
    });
  }
}
