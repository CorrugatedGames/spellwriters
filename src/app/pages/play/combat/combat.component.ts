import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPauseComponent } from '../../../components/play/modal-pause/modal-pause.component';
import {
  canDrawExtraCard,
  combatState,
  combatstateInitOptions,
  createBlankCombatState,
  createBlankStateMachineMap,
  doExtraCardDraw,
  drawCardAndPassPhase,
  endTurnAndPassPhase,
  getListOfTargetableTilesForSpellBasedOnPattern,
  getRelicById,
  getSpaceFromField,
  getSpellById,
  getStatusEffectById,
  getTargettableSpacesForSpellAroundPosition,
  handleEntireSpellcastSequence,
  healthCostForDraw,
  ingameErrorMessage,
  isFieldSpaceEmpty,
  manaCostForSpell,
  phaseBannerString,
  resetCombatState,
  setIngameErrorMessage,
  setPhaseBannerString,
  startCombat,
  stateMachineMapFromGameState,
} from '../../../helpers';
import {
  CombatPhase,
  CombatTurnOrder,
  type CombatSelectedCard,
  type CombatState,
  type CombatStateInitOpts,
  type CurrentCombatPhase,
  type FieldNode,
  type Relic,
  type Spell,
  type StatusEffect,
} from '../../../interfaces';
import { ContentService } from '../../../services/content.service';
import { DebugService } from '../../../services/debug.service';

@Component({
  selector: 'sw-combat',
  templateUrl: './combat.component.html',
  styleUrl: './combat.component.scss',
})
export class CombatComponent {
  private router = inject(Router);
  private modalService = inject(NgbModal);
  public contentService = inject(ContentService);
  public debugService = inject(DebugService);

  public gamestate: CombatState = createBlankCombatState();
  public gamephase: CurrentCombatPhase = createBlankStateMachineMap();

  public hoveringTile?: FieldNode;
  public activeCardData?: CombatSelectedCard;
  public selectableTiles:
    | Record<number, Record<number, boolean | undefined> | undefined>
    | undefined;

  public targetTiles: Record<number, undefined | Record<number, Spell>> = {};
  public victoryActions: Array<{ text: string; action: () => void }> = [];

  public relics: Array<{ relic: Relic; count: number }> = [];
  public statusEffects: Array<{ statusEffect: StatusEffect; count: number }> =
    [];

  public readonly phaseBannerString = phaseBannerString.asReadonly();
  public readonly errorMessageString = ingameErrorMessage.asReadonly();

  public readonly trackState = effect(() => {
    this.gamestate = combatState();
    this.gamephase = stateMachineMapFromGameState({ state: this.gamestate });

    this.parseRelics();
    this.parseStatusEffects();

    if (this.gamestate.currentPhase === CombatPhase.Victory) {
      this.createVictoryActions();
    } else {
      this.victoryActions = [];
    }

    if (!this.gamestate.id) {
      this.router.navigate(['/']);
    }
  });

  public get player() {
    return this.gamestate.players[CombatTurnOrder.Player];
  }

  public get opponent() {
    return this.gamestate.players[CombatTurnOrder.Opponent];
  }

  public get activeSpell(): Spell | undefined {
    if (!this.activeCardData) return undefined;

    return getSpellById(this.activeCardData.card.spellId);
  }

  private parseRelics() {
    const player = this.gamestate.players[CombatTurnOrder.Player];
    const relicHash = player.relics;

    this.relics = Object.keys(relicHash).map((relicId) => {
      const relic = getRelicById(relicId);
      return { relic, count: relicHash[relicId] };
    }) as Array<{ relic: Relic; count: number }>;
  }

  private parseStatusEffects() {
    const player = this.gamestate.players[CombatTurnOrder.Player];
    const statusEffectHash = player.statusEffects;

    this.statusEffects = Object.keys(statusEffectHash).map((statusEffectId) => {
      const statusEffect = getStatusEffectById(statusEffectId);
      return { statusEffect, count: statusEffectHash[statusEffectId] };
    }) as Array<{ statusEffect: StatusEffect; count: number }>;
  }

  public drawCard() {
    drawCardAndPassPhase({ character: this.player });
  }

  public selectCard($event: CombatSelectedCard | undefined) {
    if (!this.gamephase.PlayerTurn) return;

    if (!$event) {
      this.activeCardData = undefined;
      return;
    }

    const spell = getSpellById($event.card.spellId);
    if (!spell) return;

    if (
      manaCostForSpell({ character: this.player, spell }) > this.player.mana
    ) {
      setIngameErrorMessage({
        message: `Not enough mana to cast ${spell.name}!`,
      });
      return;
    }

    const targettableTilesList = getListOfTargetableTilesForSpellBasedOnPattern(
      {
        spell,
        turn: CombatTurnOrder.Player,
      },
    );
    if (targettableTilesList.length === 0) {
      setIngameErrorMessage({
        message: `No targetable tiles for ${spell.name}!`,
      });
      return;
    }

    this.activeCardData = $event;

    this.selectableTiles = {};
    targettableTilesList.forEach((tile) => {
      this.selectableTiles![tile.y] = this.selectableTiles![tile.y] || {};
      this.selectableTiles![tile.y]![tile.x] = true;
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

    const spell = getSpellById(this.activeCardData.card.spellId);
    if (!spell) return;

    if (!this.selectableTiles?.[y]?.[x]) return;

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

    const spell = getSpellById(this.activeCardData.card.spellId);
    if (!spell) return;

    if (spell.cost > this.player.mana) {
      setIngameErrorMessage({
        message: `Not enough mana to cast ${spell.name}!`,
      });
      return;
    }

    handleEntireSpellcastSequence({
      character: this.player,
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
          resetCombatState();

          const oldOpts = combatstateInitOptions();
          if (!oldOpts) {
            this.router.navigate(['/new-run']);
            return;
          }

          startCombat({ gamestateInitOpts: oldOpts as CombatStateInitOpts });
          this.router.navigate(['/play']);
          return;
        },
      },
      {
        text: 'New Run',
        action: () => {
          setPhaseBannerString({ text: '' });
          resetCombatState();
          this.router.navigate(['/new-run']);
        },
      },
      {
        text: 'Main Menu',
        action: () => {
          setPhaseBannerString({ text: '' });
          resetCombatState();
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

  extraDraw() {
    doExtraCardDraw({ character: this.player });
  }

  extraDrawCost() {
    return healthCostForDraw({ character: this.player });
  }

  canDoExtraDraw() {
    return canDrawExtraCard({ character: this.player });
  }
}
