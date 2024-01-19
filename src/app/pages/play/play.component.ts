import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import {
  createBlankGameState,
  createBlankStateMachineMap,
  drawCard,
  gamestate,
  stateMachineMapFromGameState,
} from '../../helpers';
import { aiAttemptAction } from '../../helpers/gameplay/ai';
import {
  CurrentPhase,
  GameState,
  PlayableCard,
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

  public readonly trackState = effect(() => {
    this.gamestate = gamestate();
    this.gamephase = stateMachineMapFromGameState(this.gamestate);

    aiAttemptAction();

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
    drawCard(this.player);
  }

  public selectCard($event: { card: PlayableCard; i: number }) {
    console.log($event);
  }

  nextTurn() {}
}
