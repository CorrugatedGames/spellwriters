import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPauseComponent } from '../../components/play/modal-pause/modal-pause.component';
import {
  createBlankGameState,
  createBlankStateMachineMap,
  drawCardAndPassPhase,
  endTurnAndPassPhase,
  gamestate,
  gamestateInitOptions,
  getRelicById,
  getSpaceFromField,
  getSpellById,
  getTargetableTilesForCard,
  getTargettableSpacesForSpellAroundPosition,
  handleEntireSpellcastSequence,
  ingameErrorMessage,
  isFieldSpaceEmpty,
  manaCostForSpell,
  phaseBannerString,
  resetGamestate,
  setIngameErrorMessage,
  setPhaseBannerString,
  startCombat,
  stateMachineMapFromGameState,
} from '../../helpers';
import {
  CurrentPhase,
  FieldNode,
  GamePhase,
  GameState,
  GameStateInitOpts,
  Relic,
  SelectedCard,
  Spell,
  TurnOrder,
} from '../../interfaces';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'sw-play',
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent {
  public gamestate: GameState = createBlankGameState();
  public gamephase: CurrentPhase = createBlankStateMachineMap();

  public hoveringTile?: FieldNode;
  public activeCardData?: SelectedCard;
  public selectableTiles:
    | Record<number, Record<number, boolean | undefined> | undefined>
    | undefined;

  public targetTiles: Record<number, undefined | Record<number, Spell>> = {};
  public victoryActions: Array<{ text: string; action: () => void }> = [];

  public relics: Array<{ relic: Relic; count: number }> = [];

  public readonly phaseBannerString = phaseBannerString.asReadonly();
  public readonly errorMessageString = ingameErrorMessage.asReadonly();

  public readonly trackState = effect(() => {
    this.gamestate = gamestate();
    this.gamephase = stateMachineMapFromGameState({ state: this.gamestate });

    this.parseRelics();

    if (this.gamestate.currentPhase === GamePhase.Victory) {
      this.createVictoryActions();
    } else {
      this.victoryActions = [];
    }

    if (!this.gamestate.id) {
      this.router.navigate(['/']);
    }
  });

  public get player() {
    return this.gamestate.players[TurnOrder.Player];
  }

  public get opponent() {
    return this.gamestate.players[TurnOrder.Opponent];
  }

  public get activeSpell(): Spell | undefined {
    if (!this.activeCardData) return undefined;

    return getSpellById(this.activeCardData.card.id);
  }

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public contentService: ContentService,
  ) {}

  private parseRelics() {
    const player = this.gamestate.players[TurnOrder.Player];
    const relicHash = player.relics;

    this.relics = Object.keys(relicHash).map((relicId) => {
      const relic = getRelicById(relicId);
      return { relic, count: relicHash[relicId] };
    }) as Array<{ relic: Relic; count: number }>;
  }

  public drawCard() {
    drawCardAndPassPhase(this.player);
  }

  public selectCard($event: SelectedCard | undefined) {
    if (!this.gamephase.PlayerTurn) return;

    if (!$event) {
      this.activeCardData = undefined;
      return;
    }

    const spell = getSpellById($event.card.id);
    if (!spell) return;

    if (
      manaCostForSpell({ character: this.player, spell }) > this.player.mana
    ) {
      setIngameErrorMessage({
        message: `Not enough mana to cast ${spell.name}!`,
      });
      return;
    }

    this.activeCardData = $event;

    this.selectableTiles = getTargetableTilesForCard({
      turn: this.gamestate.currentTurn,
      card: spell,
    });
  }

  public resetTargettableSpaces(): void {
    this.targetTiles = {};
  }

  public getHoverInfoForTile(gridRow: number, gridCol: number): void {
    this.hoveringTile = getSpaceFromField({ x: gridCol, y: gridRow });
  }

  public resetHoverInfoForTile(): void {
    this.hoveringTile = undefined;
  }

  public showTargettableSpacesForTile(y: number, x: number): void {
    if (!this.activeCardData) return;

    const spell = getSpellById(this.activeCardData.card.id);
    if (!spell) return;

    this.targetTiles = getTargettableSpacesForSpellAroundPosition({
      spell,
      x,
      y,
    });
  }

  public canSelectTile(y: number, x: number) {
    if (!this.selectableTiles) return false;
    if (!isFieldSpaceEmpty({ x, y })) return false;

    return this.selectableTiles[y]?.[x];
  }

  public selectTile(y: number, x: number) {
    if (!this.activeCardData) return;
    if (!this.canSelectTile(y, x)) return;

    const spell = getSpellById(this.activeCardData.card.id);
    if (!spell) return;

    if (spell.cost > this.player.mana) {
      setIngameErrorMessage({
        message: `Not enough mana to cast ${spell.name}!`,
      });
      return;
    }

    handleEntireSpellcastSequence({
      character: this.player,
      spellQueue: this.gamestate.spellQueue,
      x,
      y,
      turnOrder: this.gamestate.currentTurn,
      card: this.activeCardData.card,
    });

    this.selectCard(undefined);
    this.selectableTiles = undefined;
    this.resetTargettableSpaces();
  }

  nextTurn() {
    endTurnAndPassPhase();
  }

  isSecretPlayerTile(y: number) {
    return y === this.gamestate.field.length - 1;
  }

  isSecretOpponentTile(y: number) {
    return y === 0;
  }

  createVictoryActions() {
    this.victoryActions = [
      {
        text: 'Start Over',
        action: () => {
          setPhaseBannerString({ text: '' });
          resetGamestate();

          const oldOpts = gamestateInitOptions();
          if (!oldOpts) {
            this.router.navigate(['/new-run']);
            return;
          }

          startCombat({ gamestateInitOpts: oldOpts as GameStateInitOpts });
          this.router.navigate(['/play']);
          return;
        },
      },
      {
        text: 'New Run',
        action: () => {
          setPhaseBannerString({ text: '' });
          resetGamestate();
          this.router.navigate(['/new-run']);
        },
      },
      {
        text: 'Main Menu',
        action: () => {
          setPhaseBannerString({ text: '' });
          resetGamestate();
          this.router.navigate(['/']);
        },
      },
    ];
  }

  pauseGame() {
    this.modalService.open(ModalPauseComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-gamepause',
    });
  }
}
