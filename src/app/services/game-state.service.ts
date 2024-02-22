import { Injectable, effect, inject, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { interval } from 'rxjs';
import {
  DEFAULT_DELAY,
  aiAttemptAction,
  createBlankGameState,
  debugGamestate,
  declareVictory,
  gamestate,
  gamestateInitOptions,
  handleEndOfTurnSpellActions,
  hasAnyoneWon,
  nextPhase,
  saveDebugGamestate,
  saveGamestate,
  setPhaseBannerString,
} from '../helpers';
import { spriteIterationCount } from '../helpers/static/sprite';
import { delay } from '../helpers/static/time';
import { GamePhase, TurnOrder, type GameState } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private localStorage = inject(LocalStorageService);

  private hasLoaded = signal<boolean>(false);

  private state: GameState = createBlankGameState();
  private previousPhase!: GamePhase;
  private movingSpells = false;

  constructor() {
    effect(() => {
      if (!this.hasLoaded()) return;

      this.state = gamestate();
      console.info('[State Update]', this.state);
      this.saveGamestate(this.state);
    });

    effect(() => {
      if (!this.hasLoaded()) return;

      const debugState = debugGamestate();
      this.localStorage.store('debuggamestate', debugState);
    });

    effect(() => {
      if (!this.hasLoaded()) return;

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

    const debugstate = this.localStorage.retrieve('debuggamestate');
    if (debugstate?.id) {
      saveGamestate(debugstate);
      saveDebugGamestate(debugstate);
    }

    const initOpts = this.localStorage.retrieve('initopts');
    if (initOpts) {
      gamestateInitOptions.set(initOpts);
    }

    this.hasLoaded.set(true);
  }

  saveGamestate(saveState: GameState) {
    this.localStorage.store('gamestate', saveState);
  }

  saveDebugGamestate(saveState: GameState) {
    this.localStorage.store('debuggamestate', saveState);
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
