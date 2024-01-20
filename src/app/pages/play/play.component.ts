import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import {
  createBlankGameState,
  createBlankStateMachineMap,
  drawCardAndPassPhase,
  endTurnAndPassPhase,
  gamestate,
  phaseBannerString,
  stateMachineMapFromGameState,
} from '../../helpers';
import {
  CurrentPhase,
  GameState,
  SelectedCard,
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

  public readonly phaseBannerString = phaseBannerString.asReadonly();

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

  constructor(private router: Router, public contentService: ContentService) {}

  public drawCard() {
    drawCardAndPassPhase(this.player);
  }

  public selectCard($event: SelectedCard | undefined) {
    if (!this.gamephase.PlayerTurn) return;
    this.activeCardData = $event;
  }

  nextTurn() {
    endTurnAndPassPhase();
  }
}
