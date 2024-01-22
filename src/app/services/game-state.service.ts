import { Injectable, effect } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { interval } from 'rxjs';
import {
  aiAttemptAction,
  createBlankGameState,
  gamestate,
  handleEndOfTurnSpellActions,
  nextPhase,
  phaseBannerString,
  phaseNameFromGameState,
  saveGamestate,
} from '../helpers';
import { GamePhase, GameState, TurnOrder } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private state: GameState = createBlankGameState();
  private previousPhase = '';
  private currentPhaseDisplay = '';
  private movingSpells = false;

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
    interval(1000).subscribe(async () => {
      const currentPhase = phaseNameFromGameState(this.state);
      if (currentPhase !== this.previousPhase) {
        this.previousPhase = currentPhase;
        this.currentPhaseDisplay = currentPhase;
      } else {
        this.currentPhaseDisplay = '';
      }

      phaseBannerString.set(this.currentPhaseDisplay);

      const currentPlayer = this.state.players[this.state.currentTurn];

      if (
        this.state.currentPhase === GamePhase.Draw &&
        currentPlayer.deck.length === 0
      ) {
        nextPhase();
        return;
      }

      if (
        this.state.currentPhase === GamePhase.SpellMove &&
        !this.movingSpells
      ) {
        this.movingSpells = true;
        await handleEndOfTurnSpellActions(this.state);
        this.movingSpells = false;
        nextPhase();
        return;
      }

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
