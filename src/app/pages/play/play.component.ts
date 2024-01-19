import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import {
  createBlankGameState,
  createBlankStateMachineMap,
  drawCard,
  gamestate,
  stateMachineMapFromGameState,
} from '../../helpers';
import { CurrentPhase, GameState, PlayableCard } from '../../interfaces';
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

    if (!this.gamestate.id) {
      this.router.navigate(['/']);
    }
  });

  public get player() {
    return this.gamestate.players[0];
  }

  public get opponent() {
    return this.gamestate.players[1];
  }

  constructor(private router: Router, public contentService: ContentService) {}

  public drawCard() {
    drawCard(this.player);
  }

  public selectCard($event: { card: PlayableCard; i: number }) {
    console.log($event);
  }
}
