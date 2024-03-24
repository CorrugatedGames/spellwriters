import { Injectable, effect, inject, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { interval } from 'rxjs';
import {
  DEFAULT_DELAY,
  aiAttemptAction,
  combatstate,
  combatstateInitOptions,
  createBlankCombatState,
  debugCombatstate,
  declareVictory,
  handleEndOfTurnSpellActions,
  hasAnyoneWon,
  nextPhase,
  saveCombatstate,
  saveDebugCombatstate,
  setPhaseBannerString,
} from '../helpers';
import { spriteIterationCount } from '../helpers/static/sprite';
import { delay } from '../helpers/static/time';
import { GamePhase, TurnOrder, type CombatState } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CombatStateService {
  private localStorage = inject(LocalStorageService);

  private hasLoaded = signal<boolean>(false);

  private state: CombatState = createBlankCombatState();
  private previousPhase!: GamePhase;
  private movingSpells = false;

  constructor() {
    effect(() => {
      if (!this.hasLoaded()) return;

      this.state = combatstate();
      console.info('[State Update]', this.state);
      this.saveGamestate(this.state);
    });

    effect(() => {
      if (!this.hasLoaded()) return;

      const debugState = debugCombatstate();
      this.localStorage.store('debugcombatstate', debugState);
    });

    effect(() => {
      if (!this.hasLoaded()) return;

      const initOpts = combatstateInitOptions();
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
    const state = this.localStorage.retrieve('combatstate');
    if (state) {
      saveCombatstate({ state });
    }

    const debugstate = this.localStorage.retrieve('debugcombatstate');
    if (debugstate?.id) {
      saveCombatstate({ state: debugstate });
      saveDebugCombatstate({ state: debugstate });
    }

    const initOpts = this.localStorage.retrieve('initopts');
    if (initOpts) {
      combatstateInitOptions.set(initOpts);
    }

    this.hasLoaded.set(true);
  }

  saveGamestate(saveState: CombatState) {
    this.localStorage.store('combatstate', saveState);
  }

  saveDebugGamestate(saveState: CombatState) {
    this.localStorage.store('debugcombatstate', saveState);
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
