import { Injectable, effect } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { interval } from 'rxjs';
import {
  DEFAULT_DELAY,
  aiAttemptAction,
  createBlankGameState,
  declareVictory,
  delay,
  gamestate,
  gamestateInitOptions,
  handleEndOfTurnSpellActions,
  hasAnyoneWon,
  nextPhase,
  saveGamestate,
  setPhaseBannerString,
} from '../helpers';
import { spriteIterationCount } from '../helpers/static/sprite';
import { GamePhase, GameState, TurnOrder } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private state: GameState = createBlankGameState();
  private previousPhase!: GamePhase;
  private movingSpells = false;

  constructor(private localStorage: LocalStorageService) {
    effect(() => {
      this.state = gamestate();
      console.info('[State Update]', this.state);
      this.save(this.state);
    });

    effect(() => {
      const initOpts = gamestateInitOptions();
      if (initOpts) {
        this.localStorage.store('initopts', initOpts);
      }
    });
  }

  async init() {
    this.load();
    this.handleGameLoop();
    this.handleSpriteLoop();
  }

  load() {
    const state = this.localStorage.retrieve('gamestate');
    if (state) {
      saveGamestate(state);
    }

    const initOpts = this.localStorage.retrieve('initopts');
    if (initOpts) {
      gamestateInitOptions.set(initOpts);
    }
  }

  save(saveState: GameState) {
    if (!saveState.id) return;

    this.localStorage.store('gamestate', saveState);
  }

  handleSpriteLoop() {
    interval(100).subscribe(() => {
      spriteIterationCount.set(spriteIterationCount() + 1);
    });
  }

  handleGameLoop() {
    const runGameloop = async () => {
      setTimeout(() => {
        gameloop();
      }, 1000);
    };

    // real gameloop
    const gameloop = async () => {
      const currentPlayer = this.state.players[this.state.currentTurn];
      const { currentPhase, currentTurn } = this.state;

      this.previousPhase = currentPhase;

      if (currentPhase === GamePhase.Start) {
        await nextPhase();
        return runGameloop();
      }

      if (currentPhase === GamePhase.Victory) {
        const message =
          this.state.currentTurn === TurnOrder.Player
            ? 'You win!'
            : 'You lose!';
        setPhaseBannerString({ text: message, delay: -1 });
        return runGameloop();
      }

      if (hasAnyoneWon() && this.previousPhase !== GamePhase.Victory) {
        declareVictory();
        return runGameloop();
      }

      if (currentPhase === GamePhase.Draw && currentPlayer.deck.length === 0) {
        await nextPhase();
        return runGameloop();
      }

      if (currentPhase === GamePhase.SpellMove && !this.movingSpells) {
        this.movingSpells = true;

        await delay(DEFAULT_DELAY);
        await handleEndOfTurnSpellActions();
        this.movingSpells = false;

        await delay(DEFAULT_DELAY);
        await nextPhase();
        return runGameloop();
      }

      if (currentPhase === GamePhase.End) {
        await delay(DEFAULT_DELAY);
        await nextPhase();
        return runGameloop();
      }

      if (currentTurn === TurnOrder.Opponent) {
        await aiAttemptAction();
        return runGameloop();
      }

      runGameloop();
    };

    runGameloop();
  }
}
