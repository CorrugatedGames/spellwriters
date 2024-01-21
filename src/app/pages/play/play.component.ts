import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import {
  addSpellCast,
  castSpell,
  chooseTargetableTilesForCard,
  createBlankGameState,
  createBlankStateMachineMap,
  drawCardAndPassPhase,
  endTurnAndPassPhase,
  gamestate,
  getId,
  ingameErrorMessage,
  loseCardInHand,
  manaCostForSpell,
  phaseBannerString,
  setFieldSpell,
  setIngameErrorMessage,
  spendMana,
  stateMachineMapFromGameState,
} from '../../helpers';
import {
  CurrentPhase,
  FieldSpell,
  GameState,
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

  public activeCardData?: SelectedCard;
  public selectableTiles:
    | Record<number, Record<number, boolean | undefined> | undefined>
    | undefined;

  public readonly phaseBannerString = phaseBannerString.asReadonly();
  public readonly errorMessageString = ingameErrorMessage.asReadonly();

  public readonly trackState = effect(() => {
    this.gamestate = gamestate();
    this.gamephase = stateMachineMapFromGameState(this.gamestate);

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

    return this.contentService.getSpell(this.activeCardData.card.id);
  }

  constructor(private router: Router, public contentService: ContentService) {}

  public drawCard() {
    drawCardAndPassPhase(this.player);
  }

  public selectCard($event: SelectedCard | undefined) {
    if (!this.gamephase.PlayerTurn) return;

    if (!$event) {
      this.activeCardData = undefined;
      return;
    }

    const card = this.contentService.getSpell($event.card.id);
    if (!card) return;

    if (manaCostForSpell(this.player, card) > this.player.mana) {
      setIngameErrorMessage(`Not enough mana to cast ${card.name}!`);
      return;
    }

    this.activeCardData = $event;

    this.selectableTiles = chooseTargetableTilesForCard(
      this.gamestate.field,
      this.gamestate.currentTurn,
      card,
    );
  }

  public canSelectTile(y: number, x: number) {
    if (!this.selectableTiles) return false;

    return this.selectableTiles[y]?.[x] ?? false;
  }

  public selectTile(y: number, x: number) {
    if (!this.activeCardData) return;
    if (!this.canSelectTile(y, x)) return;

    const spell = this.contentService.getSpell(this.activeCardData.card.id);
    if (!spell) return;

    if (spell.cost > this.player.mana) {
      setIngameErrorMessage(`Not enough mana to cast ${spell.name}!`);
      return;
    }

    const newlyCastSpell: FieldSpell = {
      ...spell,
      caster: TurnOrder.Player,
      castId: getId(),
    };

    castSpell(this.gamestate.spellQueue, newlyCastSpell);
    setFieldSpell(this.gamestate.field, x, y, newlyCastSpell);
    loseCardInHand(this.player, this.activeCardData.index);
    spendMana(this.player, manaCostForSpell(this.player, spell));
    addSpellCast(this.player);

    this.selectCard(undefined);
    this.selectableTiles = undefined;
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
}
